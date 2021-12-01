import Fuse from 'fuse.js'
import React from 'react'
import FuzzyHighlighter, { Highlighter } from 'react-fuzzy-highlighter'
import { render, mainCss } from './style'
import { fnCall, TmSlot } from './slottable'


export type Component<T> = React.ComponentType<T>
export type VNode = React.ReactNode


/** Returns the best N fuzzy results of a list of documents.  */
function fuzzy(data: object[], keys: any, query: string, maxResults?: number) {
  const fuse = new Fuse(data, {
    shouldSort: true,
    includeMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: keys,
  });
  return fuse.search(query).slice(0, maxResults || 5);
}

// itemToString(item) => string
// itemFilter (item) => bool
// itemRender (item) => VNode
// onPick 
// .data = item[]
// .dataFilterKey = string

type Item = object;
type ItemToStr = (item: Item) => string | null;
type ItemFilter = (item: Item) => boolean;
type ItemRender = (item: Item, hl: any) => VNode;
type ItemPick = CustomEvent<Item>;

class SearchField extends TmSlot {
  private root: HTMLElement

  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
  }
  
  private _props = {
    itemToString: ((i) => null) as ItemToStr,
    itemFilter: (i: Item) => true,
    itemRender: ((i: Item, hl: any) => JSON.stringify(i)) as ItemRender,
    data: [] as Item[],
    dataFilterKey: "label" as string
  }

  private _events = {
    pick: (item: Item) => {
      this.dispatchEvent(new CustomEvent('pick', {
        detail: item
      }) as ItemPick)
    }
  }

  set itemToString(fn: ItemToStr) {
    this._props.itemToString = fn
  }

  set itemFilter(fn: ItemFilter) {
    this._props.itemFilter = fn
  }

  set itemRender(fn: ItemRender) {
    this._props.itemRender = fn
  }

  set data(items: Item[]) {
    this._props.data = items;
    this._suggestionList = items;
    this.render() 
  }

  connectedCallback() {
    this.render()
    this.slotSetup(this.root, () => this.render())
  }

  private _suggestionList: any[] = []

  private _rowFn = (o: any, highlight: VNode) : VNode => {
    // by default just render the label
    return <>{this.objToString(o)}</>
  }

  public objToString(o: any) {
    if (o != null && typeof o == 'object' && 'label' in o) {
      return o.label
    }
    return '[missing label key]'
  }

  public set objtostring(fnStr: string) {
    this.objToString = (o: any) => fnCall(fnStr, o)
  }

  private fuzzyRenderer(WindiItem: Component<WindiProps>): any {
    if (this.autofuzz == null) return

    return (<FuzzyHighlighter
      query={this._lastRealValue}
      data={this.suggestions}
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
        let { results, formattedResults, timing } = props
        if (results.length == 0) {
          return <></>
        }

        return (formattedResults.map((opt, idx) => {
          const row = this._props.itemRender(opt.item, <Highlighter text={opt.formatted.label} />)
          return (
            <WindiItem idx={opt.refIndex}>{row}</WindiItem>
          )
        }))
      }}
    </FuzzyHighlighter>)
  }

  public autofuzz: string | null = null;

  get rowRender() {
    return this._rowFn
  }

  set rowRender(fn: (opt: any, mark: VNode) => VNode) {
    this._rowFn = fn
    this.render()
  }

  set suggestions(opts: any[]) {
    opts.forEach(x => {
      if (typeof x == 'object' && x != null && 'label' in x) {
      } else {
        console.error('each autocomplete option must contain "label" key')
      }
    })
    this._suggestionList = opts
    this.render()
  }

  myFuzzy() : ItemFilter {
    const results: Item[] =  fuzzy(this._suggestionList, [this._props.dataFilterKey], this._lastRealValue).map(x => x.item);
    const getKey = (i: Item) => {
      return (i as any)[this._props.dataFilterKey];
    }
    return (R: Item) => typeof results.find(y => y === getKey(R)) != 'undefined';
  }

  filterChain() : ItemFilter[] {
    let all: ItemFilter[] = [];
    all.push(this._props.itemFilter);
    if(this._props.dataFilterKey) {
      all.push(this.myFuzzy())
    }
    return all;
  } 

  get suggestions(): Item[] {
    let res = this._props.data;
    this.filterChain().forEach((fn: ItemFilter) => {
      res = res.filter(x => fn(x));
    });
    return res;
  }

  static get observedAttributes() {
    return ['options', 'rowrender', 'autofuzz', 'objtostring']
  }

  set rowrender(fn: string) {
    this.rowRender = (opt, mark) => fnCall(fn as string, opt, mark)
  }

  private handleNativeInput(e: Event) {
    const curVal = this.input.value
    if (e.type == 'input' && this._lastRealValue != curVal) {
      this._lastRealValue = curVal
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
    if (idx >= this.suggestions.length) return
    this.value = this.objToString(this.suggestions[idx])
    this._lastRealValue = this.value
    this._hideCompleteBox = true
    this.dispatchEvent(
      new CustomEvent('pick', {
        detail: this.suggestions[idx],
      }),
    )
    if (skipRender !== false) {
      this.render()
    }
  }

  public moveSelect(delta: number) {
    this.selectedIndex += delta
    this.selectedIndex = (this.selectedIndex % (this.suggestions.length + 1))
    if (this.selectedIndex == this.suggestions.length || this.selectedIndex == -1) {
      this.value = this._lastRealValue
    } else {
      this.value = this.objToString(this.suggestions[this.selectedIndex])
    }
    this.render()
  }

  public selectedIndex = -1
  /** Holds the last value typed by the user, rather than the one
   *  that's shown, which can be an autocomplete suggestion.
   */
  private _lastRealValue = ''

  public get value(): string {
    return this._lastRealValue
  }

  public set value(s: string) {
    this.input.value = s
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
        this._suggestionList = optTags.map((x: HTMLOptionElement) => {
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
          <button class='cursor-pointer bg-white w-auto flex rounded-r justify-end items-center text-blue-500 p-2 hover:text-blue-400'>
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
    const click = (idx: number) => {
      this.accept(idx)
    }

    const WindiItem = (props: WindiProps) => {
      const active = this.selectedIndex === props.idx
      let extraCls = active ? 'bg-indigo-500 !text-white' : 'hover:bg-[#3366CC20]'
      return <li
        onMouseDown={e => click(props.idx)}
        id='listbox-item-1'
        role='option'
        class={'cursor-pointer text-gray-900 select-none relative py-2 pr-9 ' + extraCls}
      >
        <div class='flex items-center'>
          <span class='ml-3 block font-normal truncate'>
            {props.children}
          </span>
        </div>
      </li>
    }

    let optList: VNode = []
    if (this.autofuzz !== null) {
      if(this.suggestions.length == 0) return <></>
      optList = this.fuzzyRenderer(WindiItem)
      if (this._hideCompleteBox) return <></>
    } else {
      if (!this.suggestions || !this.suggestions.length || this._hideCompleteBox) return <></>
      optList = this.suggestions.map((x, idx) => {
        return <WindiItem idx={idx}>{this._rowFn(x, this.objToString(x))}</WindiItem>
      })
    }

    return <div
      id='autolist' style="z-index: 35"
      class='absolute top-9 w-full border-t-1 border-gray-300 border-solid bg-white shadow-lg'
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
}

import './icons/el'

const vn = document.createElement('style')
vn.textContent = mainCss
document.head.append(vn)

import { Alert, Tabs } from './alert'
import { Code } from './codehl'
import { Dialog } from './dialog'
import { Table } from './table'
import { Tree } from './tree'

function loadComponents() {
  customElements.define('v-tree', Tree)
  customElements.define('v-search', SearchField)
  customElements.define('v-dialog', Dialog)
  customElements.define('v-table', Table)
  customElements.define('v-alert', Alert)
  customElements.define('v-code', Code);
  customElements.define('v-tabs', Tabs);
}

// TODO: Make different versions of the library
// one of which doesn't auto-load the components.
loadComponents()

type WindiProps = { idx: number, children?: any }
