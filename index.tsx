import Fuse from 'fuse.js'
import React from 'react'
import FuzzyHighlighter, { Highlighter } from 'react-fuzzy-highlighter'
import { render } from './style'
import { fnCall, fnCallSetup, html, Slottable, TmSlot } from './slottable'
import './util/types.d.ts'


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
type ItemTransform = (items: Item[]) => Item[];
type ItemRender = (item: Item, hl: any) => VNode;
type ItemPick = CustomEvent<Item>;

class SearchField extends Slottable {
  private root: HTMLElement


  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
  }

  private _props = {
    itemToString: ((i) => JSON.stringify(i)) as ItemToStr,
    itemTransform: (i: Item[]) => i,
    itemRender: ((i: Item, hl: any) => <span>{JSON.stringify(i)}</span>) as ItemRender,
    data: [] as Item[],
    dataFilterKey: "",
    placeholder: "Search..."
  }

  private _events = {
    pick: (item: Item) => {
      this.dispatchEvent(new CustomEvent('pick', {
        detail: item
      }) as ItemPick)
    }
  }

  set searchKey(k: string) {
    this._props.dataFilterKey = k;
    this.autofuzz = k;
  }

  set itemToString(fn: ItemToStr) {
    this._props.itemToString = fn
  }

  set itemTransform(fn: ItemTransform) {
    this._props.itemTransform = fn
  }

  set searchRender(fn: ItemRender) {
    this._props.itemRender = fn
  }

  set data(items: Item[]) {
    this._props.data = items;
    this.render() 
  }

  connectedCallback() {
    this.render()
    this.slotSetup(this.root, () => this.render())
  }

  private fuzzyRenderer(WindiItem: Component<WindiProps>): any {
    if (this.autofuzz == null) return
    
    return (<FuzzyHighlighter
      query={this._lastRealValue}
      data={this.filteredData}
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
        let { results, formattedResults } = props
        if (results.length == 0) {
          return <></>
        }

        return (formattedResults.map((opt, idx) => {
          const row = this._props.itemRender(opt.item, <Highlighter text={opt.formatted[this._props.dataFilterKey]} />)
          return (
            <WindiItem idx={idx}>{row}</WindiItem>
          )
        }))
      }}
    </FuzzyHighlighter>)
  }

  public autofuzz: string | null = null;

  set placeholder(s: string) {
    this._props.placeholder = s;
    console.log('ok bitch')
    this.render()
  }

  myFuzzy() : ItemTransform {
    return (x) => fuzzy(x, [this._props.dataFilterKey], this._lastRealValue).map(x => x.item)
    // const results: Item[] =  fuzzy(this._props.data, [this._props.dataFilterKey], this._lastRealValue).map(x => x.item);
    
    // const getKey = (i: Item) => {
    //   return (i as any)[this._props.dataFilterKey];
    // }

    // return (R: Item) => (typeof results.find(y => getKey(y) === getKey(R))) != 'undefined';
  }

  private transformChain() : ItemTransform[] {
    let all: ItemTransform[] = [];
    all.push(this._props.itemTransform);
    if(this._props.dataFilterKey) {
      all.push(this.myFuzzy())
    }
    return all;
  } 

  get filteredData(): Item[] {
    let res = this._props.data;
    
    this.transformChain().forEach((fn: ItemTransform) => {
      res = fn(res);
    });
    return res;
  }

  static get observedAttributes() {
    return ['options', 'autofuzz', 'objtostring', 'placeholder', 'searchKey', 'data', 'searchrender']
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
      this.hideSuggestions = true
      this.render()
    }
    if (e.type === 'focus') {
      this.hideSuggestions = false
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

  // puts an Item into <input> if Item.toString()
  // is defined. if not, it returns false
  private putSuggestionIntoField(item: Item): boolean {
    const maybeStr = this._props.itemToString(item);
    if(maybeStr === null) {
      // the item cannot be put into text fields
      return false
    }
    this.value = maybeStr
    return true
  }

  private accept(idx: number, skipRender?: boolean) {
    if (idx <= -1) return
    if (idx >= this.filteredData.length) return
    
    const item = this.filteredData[idx]
    // const inpText = this._props.itemToString(this.suggestions[idx]);
    if(!this.putSuggestionIntoField(item)) {

    }

    this._lastRealValue = this.value
    this.hideSuggestions = true
    this.dispatchEvent(
      new CustomEvent('pick', {
        detail: this.filteredData[idx],
      }),
    )
    if (skipRender !== false) {
      this.render()
    }
  }

  public moveSelect(delta: number) {
    this.selectedIndex += delta
    console.log("before", this.selectedIndex)
    this.selectedIndex = (this.selectedIndex % (this.filteredData.length + 1))
    console.log("after", this.selectedIndex)
    if (this.selectedIndex == this.filteredData.length || this.selectedIndex == -1) {
      this.value = this._lastRealValue
    } else {
      this.putSuggestionIntoField(this.filteredData[this.selectedIndex])
      // this.value = this.objToString(this.suggestions[this.selectedIndex])
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

  private scriptSetup = false;
  private render() {
    if (!this.root) return

    let handlers: Record<string, any> = {}
    ;(['onInput', 'onChange', 'onBlur', 'onFocus', 'onContextMenu', 'onSelect', 'onKeyUp', 'onKeyDown', 'onKeyPress'])
      .map(x => {
        handlers[x] = (e: Event) => this.handleNativeInput(e)
      })

    render(
      <div class='flex flex-col relative input-wrapper-root'>
        <div class='flex input-wrapper'>
          <input
            {...handlers}
            class='main-input w-full rounded p-2 outline-none focus:ring-2 focus:sibling:ring-2'
            type='text'
            placeholder={this._props.placeholder}
          />
          <button class='cursor-pointer w-auto flex rounded-r justify-end items-center text-blue-500 p-2 hover:text-blue-400 right-button'>
            <slot name="icon"><v-icon class='text-blue-500' name='Search'></v-icon></slot>
          </button>
        </div>

        {this.autocomplete()}
        <div class='hidden'>
          <slot name='setup'></slot>
          <slot></slot>
        </div>
      </div>,
      this.root,
    )
  }

  public hideSuggestions = false

  private autocomplete() {
    const click = (idx: number) => {
      this.accept(idx)
    }

    const WindiItem = (props: WindiProps) => {
      const active = this.selectedIndex === props.idx
      let extraCls = active ? 'active bg-indigo-500 !text-white' : 'hover:bg-[#3366CC20]'
      return <li
        onMouseDown={e => click(props.idx)}
        role='option'
        class={'suggestion cursor-pointer text-gray-900 select-none relative py-2 pr-9 ' + extraCls}
      >
        <div class='flex items-center'>
          <span class='ml-3 block font-normal truncate'>
            {props.children}
          </span>
        </div>
      </li>
    }

    let optList: VNode = []
    if(this.filteredData.length === 0 || this.hideSuggestions) return <></>;

    if(this._props.dataFilterKey) {
      optList = this.fuzzyRenderer(WindiItem)
    } else {
      optList = this.filteredData.map((x, idx) => {
        return <WindiItem idx={idx}>{this._props.itemRender(x, <></>)}</WindiItem>
      })
      // optList = this._props.itemRender(this.filteredData, null)
    }

    return <div
      id='autolist' style="z-index: 35"
      class='absolute top-9 w-full border-t-1 border-gray-300 border-solid bg-white shadow-lg'
    >
      <ul
        role='listbox'
        aria-labelledby='listbox-label'
        aria-activedescendant='listbox-item-3'
        class='suggestion-list max-h-56 rounded-b-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'
      >
        {optList}
      </ul>
    </div>
  }
}

import './icons/el'

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

  customElements.define('v-scope', class extends HTMLElement {
    constructor() {
      super()
      this.root = this.attachShadow({mode: 'open'})
      const sl = document.createElement('slot')
      sl.addEventListener('slotchange', (e) => {
        const myEv = new CustomEvent<{slotEvent: any}>('slotnotify', {
          detail: {
          slotEvent: e
        }});

         const V = Array.from(this.children).filter(x => x.tagName.toLowerCase().startsWith('v-'));
         V.map(x => {
           x.dispatchEvent(myEv);
         })
      })
      this.root.append(sl)
    }

    root: ShadowRoot
  })
}

class VeefElement {
  static h = html;
}
window.VeefElement = VeefElement;

export {Tree, SearchField, Dialog, Table, Alert, Code, Tabs, VeefElement};

// TODO: Make different versions of the library
// one of which doesn't auto-load the components.
loadComponents()

type WindiProps = { idx: number, children?: any }
