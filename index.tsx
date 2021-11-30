import Fuse from 'fuse.js'
import React from 'react'
import FuzzyHighlighter, { Highlighter } from 'react-fuzzy-highlighter'
import { render, mainCss } from './style'
import { fnCall, TmSlot } from './slottable'

export type Component<T> = React.ReactElement<T>
export type VNode = React.ReactNode

class SearchField extends TmSlot {
  private root: HTMLElement
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
  }
  connectedCallback() {
    this.render()
    this.slotSetup(this.root, () => this.render())
  }
  private _opts: any[] = []

  private _rowFn = (o: any, highlight: VNode) => {
    // by default just render the label
    return <>{this.optionstring(o)}</>
  }

  private optionstring(o: any) {
    if (o != null && typeof o == 'object' && 'label' in o) {
      return o.label
    }
    return '[missing label key]'
  }

  public fuzzyResults: Fuse.FuseResult<any>[] = []

  private fuzzyRenderer(WindiItem: Component<WindiProps>): any {
    if (this.autofuzz == null) return

    return (<FuzzyHighlighter
      query={this._lastRealValue}
      data={this.completelist}
      options={{
        shouldSort: true,
        includeMatches: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [this.autofuzz],
      }}
    >
      {props => {
        const { results, formattedResults, timing } = props
        if (results.length == 0) {
          return <></>
        }
        this.fuzzyResults = results as any
        return (formattedResults.map((opt, idx) => {
          // const res = formattedResults.find(x => x.refIndex === idx);
          // if(!res) {highlight
          //     return <span>filtered</span>
          // }
          const row = this.rowRender(opt.item, <Highlighter text={opt.formatted.label} />)
          return (
            <WindiItem idx={opt.refIndex}>{row}</WindiItem>
          )
        }))
      }}
    </FuzzyHighlighter>)
  }

  public autofuzz: string | null = null

  get rowRender() {
    return this._rowFn
  }

  set rowRender(fn: (opt: any, mark: VNode) => VNode) {
    this._rowFn = fn
    this.render()
  }

  set completelist(opts: any[]) {
    opts.forEach(x => {
      if (typeof x == 'object' && x != null && 'label' in x) {
      } else {
        console.error('each autocomplete option must contain "label" key')
      }
    })
    this._opts = opts
    this.render()
  }

  get completelist() {
    return this.transform(this._opts, this._lastRealValue)
  }

  static get observedAttributes() {
    return ['options', 'rowrender', 'autofuzz']
  }

  set rowrender(fn: string) {
    this.rowRender = (opt, mark) => fnCall(fn as string, opt, mark)
  }

  private handleNativeInput(e: Event) {
    const curVal = this.input.value
    if (e.type == 'input' && this._lastRealValue != curVal) {
      this.fuzzyCursor = -1
      this._lastRealValue = curVal
      this._lastValue = curVal
      this.dispatchEvent(new Event(e.type))
      this.render()
      return
    }
    if (e.type === 'blur') {
      this._hideCompleteBox = true
      this.render()
    }
    if (e.type === 'focus') {
      this._hideCompleteBox = false
      this.render()
    }

    this._lastValue = curVal

    if (e.type.indexOf('key') === -1) {
      this.dispatchEvent(new Event(e.type))
    } else {
      let kbdEvent: KeyboardEvent = e as KeyboardEvent
      if (e.type !== 'keydown') return

      if (kbdEvent.key === 'Enter') {
        this.input.blur()
      }
      if (kbdEvent.key === 'ArrowDown') {
        this.moveSelect(1)
        e.preventDefault()
      }
      if (kbdEvent.key === 'ArrowUp') {
        this.moveSelect(-1)
        e.preventDefault()
      }
      if (kbdEvent.key === 'Escape') {
        this.input.blur()
      }
    }
  }

  private accept(idx: number, skipRender?: boolean) {
    if (idx <= -1) return
    if (idx >= this.completelist.length) return
    this.value = this.optionstring(this.completelist[idx])
    this._lastRealValue = this.value
    this._hideCompleteBox = true
    this.dispatchEvent(
      new CustomEvent('pick', {
        detail: this.completelist[idx],
      }),
    )
    if (skipRender !== false) {
      this.render()
    }
  }

  private fuzzyCursor = -1
  public moveSelect(delta: number) {
    if (this.autofuzz !== null) {
      this.fuzzyCursor += delta
      this.fuzzyCursor = (this.fuzzyCursor % (this.fuzzyResults.length + 1))
      if (this.fuzzyCursor < -1) this.fuzzyCursor = this.fuzzyResults.length - 1
      if (this.fuzzyCursor == -1 || this.fuzzyCursor == this.fuzzyResults.length) {
        this.value = this._lastRealValue
        this.selectedIndex = -1
      } else {
        this.selectedIndex = this.fuzzyResults[this.fuzzyCursor].refIndex
        this.value = this.optionstring(this.completelist[this.selectedIndex])
      }
      this.render()
      return
    }

    this.selectedIndex += delta
    this.selectedIndex = (this.selectedIndex % (this.completelist.length + 1))
    if (this.selectedIndex == this.completelist.length || this.selectedIndex == -1) {
      this.value = this._lastRealValue
    } else {
      this.value = this.optionstring(this.completelist[this.selectedIndex])
    }
    this.render()
  }

  public selectedIndex = -1

  private _lastValue = ''
  private _lastRealValue = ''

  public get value(): string {
    return this._lastValue
  }

  public set value(s: string) {
    this.input.value = s
    this._lastValue = s
  }

  public get input() {
    return this.root.querySelector('input') as HTMLInputElement
  }

  private render() {
    if (!this.root) return

    if ('' in this.templates) {
      let optTags = this.templates[''].filter(x => x.tagName.toLowerCase() === 'data')
      if (optTags.length > 0) {
        //@ts-ignore
        this._opts = optTags.map((x: HTMLOptionElement) => {
          return { value: x.value, label: x.textContent }
        })
      }
    }

    let handlers: Record<string, any> = {}
    ;(['onInput', 'onChange', 'onBlur', 'onFocus', 'onContextMenu', 'onSelect', 'onKeyUp', 'onKeyDown', 'onKeyPress'])
      .map(x => {
        handlers[x] = (e: Event) => this.handleNativeInput(e)
      })

    render(
      <div class='flex flex-col relative'>
        <div class='flex'>
          <input
            {...handlers}
            class='w-full rounded p-2 outline-none focus:ring-2 focus:sibling:ring-2'
            type='text'
            placeholder='Search...'
          />
          <button class='bg-white w-auto flex rounded-r justify-end items-center text-blue-500 p-2 hover:text-blue-400'>
            <v-icon class='text-blue-500' name='Search'></v-icon>
          </button>
        </div>

        {this.autocomplete()}
        <slot name='setup'></slot>
        <div class='hidden'>
          <slot></slot>
        </div>
      </div>,
      this.root,
    )
  }

  private _hideCompleteBox = false

  private autocomplete() {
    const hover = (idx: number) => {
      this.selectedIndex = idx
      this.render()
    }
    const click = (idx: number) => {
      this.accept(idx)
    }

    const WindiItem = (props: WindiProps) => {
      const active = this.selectedIndex === props.idx
      let extraCls = active ? 'bg-indigo-500 !text-white' : ''
      return <li
        onMouseOver={() => hover(props.idx)}
        onPointerDown={e => click(props.idx)}
        id='listbox-item-1'
        role='option'
        class={'text-gray-900 cursor-default select-none relative py-2 pr-9 ' + extraCls}
      >
        <div class='flex items-center'>
          <span class='ml-3 block font-normal truncate'>
            {props.children}
          </span>
        </div>
      </li>
    }

    let optList: any[] = []
    if (this.autofuzz !== null) {
      optList = this.fuzzyRenderer(WindiItem)
      if (this._hideCompleteBox) return <></>
    } else {
      if (!this.completelist || !this.completelist.length || this._hideCompleteBox) return <></>
      optList = this.completelist.map((x, idx) => {
        return <WindiItem idx={idx}>{this._rowFn(x, this.optionstring(x))}</WindiItem>
      })
    }

    return <div
      id='autolist'
      class='absolute top-9 w-full z-10 border-t-1 border-gray-300 border-solid bg-white shadow-lg'
    >
      <ul
        role='listbox'
        aria-labelledby='listbox-label'
        aria-activedescendant='listbox-item-3'
        class='max-h-56 rounded-b-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'
      >
        {optList}
      </ul>
    </div>
  }

  public transform = (x: any[], val: string) => {
    return x
  }
}

import './icons/el'
import { IconKey } from './icons/lib/icons'

const vn = document.createElement('style')
vn.textContent = mainCss
document.head.append(vn)

import { Alert } from './alert'
import { Dialog } from './dialog'
import { Table } from './table'
import { Tree } from './tree'

customElements.define('v-tree', Tree)
customElements.define('v-search', SearchField)
customElements.define('v-dialog', Dialog)
customElements.define('v-table', Table)
customElements.define('v-alert', Alert)

declare global {
 namespace JSX {
    interface IntrinsicElements  {
      'v-search': {};
      'v-icon': {name: string};
    }
}
}

type WindiProps = { idx: number, children: any }
