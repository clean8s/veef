import Fuse from 'fuse.js'
import React from 'react'
import FuzzyHighlighter, { Highlighter } from 'react-fuzzy-highlighter'
import { genCss, render, renderWithCss } from './style'
import { Attrs, fnCall, fnCallSetup, html, Props, PropsLoad, Slottable, TmSlot } from './slottable'
import '../util/types.d.ts'
import '../icons/el'
import {render as preactRender} from "preact"
import {render as pss} from "preact-render-to-string"


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
// .searchKey = string

type Item = object;
type ItemToStr = (item: Item) => string | null;
type ItemTransform = (items: Item[]) => Item[];
type ItemRender = (item: Item, hl: any) => VNode;
type ItemPick = CustomEvent<Item>;

@Attrs(["q"], (attr) => {
  console.log(attr)
})
class SearchField extends Slottable {
  private root: HTMLElement

  get props() {
    return ["_itemToString", "_itemTransform", "_itemRender", "_data", "_searchKey", "_placeholder"]
  }

  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
    this.render()
    this.slotSetup(this.root, () => this.slotted());
  }
  handlers: Record<string, any> = {};

  connectedCallback() {
    (['onInput', 'onChange', 'onBlur', 'onFocus', 'onContextMenu', 'onSelect', 'onKeyUp', 'onKeyDown', 'onKeyPress'])
    .map(ev => {
      this.handlers[ev] = (e: Event) => this.handleNativeInput(e)
    });
  }

  slotted() {
    // let handlers: Record<string, any> = {};

    this.slottedAny("input").map(x => {
      Object.entries(this.handlers).map(([ev, fn]) => {
        x.removeEventListener(ev.substring(2).toLowerCase(), fn);
        x.addEventListener(ev.substring(2).toLowerCase(), fn); 
        // console.log(x)
      });
    });
    // this.render();
    // this.root.querySelector("#mAutoComplete")?.innerHTML = pss(this.autocomplete())
    
    // preactRender(pss(this.autocomplete()), this.root.querySelector("#mAutoComplete"));
    // preactRender(this.autocomplete()
  }

  private _events = {
    pick: (item: Item) => {
      this.dispatchEvent(new CustomEvent('pick', {
        detail: item
      }) as ItemPick)
    }
  }

  _itemToString = ((i) => JSON.stringify(i)) as ItemToStr;
  _itemTransform = (i: Item[]) => i;
  _itemRender = ((i: Item, hl: any) => this._searchKey != "" ? hl : (<span>{JSON.stringify(i)}</span>) ) as ItemRender;
  _data = [] as Item[];
  _placeholder = "Hello"
  _searchKey = ""

  private fuzzyRenderer(WindiItem: Component<WindiProps>): any {
    if (this._searchKey == "") return
    
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
        keys: [this._searchKey],
      }}
    >
      {props => {
        let { results, formattedResults } = props
        if (results.length == 0) {
          return <></>
        }

        return (formattedResults.map((opt, idx) => {
          const row = this._itemRender(opt.item, <Highlighter text={opt.formatted[this._searchKey]} />)
          return (
            <WindiItem idx={idx}>{row}</WindiItem>
          )
        }))
      }}
    </FuzzyHighlighter>)
  }

  myFuzzy() : ItemTransform {
    return (x) => fuzzy(x, [this._searchKey], this._lastRealValue).map(x => x.item)
  }

  private transformChain() : ItemTransform[] {
    let all: ItemTransform[] = [];
    all.push(this._itemTransform);
    if(this._searchKey) {
      all.push(this.myFuzzy())
    }
    return all;
  } 

  get filteredData(): Item[] {
    let res = this._data;
    
    this.transformChain().forEach((fn: ItemTransform) => {
      res = fn(res);
    });
    return res;
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
      if(window.innerWidth < 600) {
      this.input.scrollIntoView();
      window.scrollBy(0, -140);
      }
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
    const maybeStr = this._itemToString(item);
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
    // const inpText = this._itemToString(this.suggestions[idx]);
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
    this.selectedIndex = (this.selectedIndex % (this.filteredData.length + 1))
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
    const inpSlot = this.slottedByTag("input", "input")
    console.log(inpSlot)
    const i = inpSlot.find(x => x.id != "default");
    if(!i) {
      return inpSlot[0];
    }
    return i;
  }

  private render() {

    const myCss = "input,::slotted(input) { " + genCss("main-input w-full rounded p-2 outline-none focus:ring-2 focus:sibling:ring-2") + "}"
    renderWithCss("")(
      <div class='flex flex-col relative input-wrapper-root'>
        <div part="input-wrapper" class='flex input-wrapper imp'>
          <slot name='input'>
          <input type="text" id="default" part="defaultinput" placeholder="Search..." slot="input"/>
            </slot>

          <button part="right-button" class='cursor-pointer w-auto flex rounded-r justify-end items-center text-blue-500 p-2 hover:text-blue-400 right-button'>
            <slot name="icon"><v-icon class='text-blue-500' name='Search'></v-icon></slot>
          </button>
        </div>

        {this.autocomplete()}
      </div>,
      this.root,
    );
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

    if(this._searchKey) {
      optList = this.fuzzyRenderer(WindiItem)
    } else {
      optList = this.filteredData.map((x, idx) => {
        return <WindiItem idx={idx}>{this._itemRender(x, <></>)}</WindiItem>
      })
      // optList = this._itemRender(this.filteredData, null)
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


import {Tree, Dialog, Table, Alert, Code, Tabs, VeefElement, loadComponents} from "./veef";
loadComponents({'v-search': SearchField})
export {Tree, SearchField, Dialog, Table, Alert, Code, Tabs, VeefElement};

// TODO: Make different versions of the library
// one of which doesn't auto-load the components.
// loadComponents()

type WindiProps = { idx: number, children?: any }
