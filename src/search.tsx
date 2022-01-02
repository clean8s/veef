import {Transformable} from "./transformable";
import React from 'react'
import {Component, VNode} from "./index";
import FuzzyHighlighter, {Highlighter} from "react-fuzzy-highlighter";
import {Attrs, OnAttr, Props} from "./slottable";
import Fuse from "fuse.js";
import {createRef} from "preact/compat";

type Item = object;
type ItemToStr = (item: Item) => string | null;
type ItemTransform = (items: Item[]) => Item[];
type ItemRender = (item: Item, hl: any) => VNode;
type ItemPick = CustomEvent<Item>;

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

@Props(["itemToText", "itemTransform", "itemRender", "data", "placeholder", "itemKey"], "doRender")
@OnAttr(["placeholder"], (t, k, v) => {t._placeholder = v; t.doRender(); })
export class Search extends Transformable {

  _itemToText = ((i) => JSON.stringify(i)) as ItemToStr;
  _itemTransform = (i: Item[]) => i;
  _itemRender = ((i: Item, hl: any) => this._itemKey != "" ? hl : (<span>{this._itemToText(i)}</span>) ) as ItemRender;
  _data = [] as Item[];
  _placeholder = "Hello"
  _itemKey = ""

  private fuzzyRenderer(WindiItem: Component<WindiProps>): any {
    if (this._itemKey == "") return

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
          keys: [this._itemKey],
        }}
    >
      {props => {
        let { results, formattedResults } = props
        if (results.length == 0) {
          return <></>
        }

        return (formattedResults.map((opt, idx) => {
          const row = this._itemRender(opt.item, <Highlighter text={opt.formatted[this._itemKey]} />)
          return (
              <WindiItem last={idx + 1 == formattedResults.length} idx={idx}>{row}</WindiItem>
          )
        }))
      }}
    </FuzzyHighlighter>)
  }

  myFuzzy() : ItemTransform {
    return (x) => fuzzy(x, [this._itemKey], this._lastRealValue).map(x => x.item)
  }

  private transformChain() : ItemTransform[] {
    let all: ItemTransform[] = [];
    all.push(this._itemTransform);
    if(this._itemKey) {
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
      this.selectedIndex = -1;
      this._lastRealValue = curVal
      this.dispatchEvent(new Event(e.type))
      this.doRender()
      return
    }
    if (e.type === 'blur') {
      if(this.rightButton.current) this.rightButton.current.setAttribute("part", "right-button");
      this.hideSuggestions = true
      this.value = this._lastRealValue
      this.doRender()
    }
    if (e.type === 'focus') {
      if(this.rightButton.current) this.rightButton.current.setAttribute("part", "right-button right-button-active");
      this.hideSuggestions = false
      if(window.innerWidth < 600) {
        // this.input.scrollIntoView();
        // window.scrollBy(0, -140);
      }
      this.doRender()
    }

    if (e.type.indexOf('key') === -1) {
      this.dispatchEvent(new Event(e.type))
    } else {
      let kbdEvent: KeyboardEvent = e as KeyboardEvent
      if (e.type !== 'keydown') return

      if (kbdEvent.key === 'Enter') {
        if(this.selectedIndex != -1)
        this.accept(this.selectedIndex, false)
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
        this.value = this._lastRealValue
        this.input.blur()
      }
    }
  }

  // puts an Item into <input> if Item.toString()
  // is defined. if not, it returns false
  private putSuggestionIntoField(item: Item): boolean {
    return true
    const maybeStr = this._itemToText(item);
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

    this._lastRealValue = this._itemToText(item)
    this.input.value = this._lastRealValue;
    this.hideSuggestions = true;
    this.selectedIndex = -1;
    this.input.dispatchEvent(new InputEvent("change"))
    this.input.dispatchEvent(new InputEvent("input"))
    this.dispatchEvent(
        new CustomEvent('pick', {
          detail: this.filteredData[idx],
        }),
    )
    this.input.dispatchEvent(
        new CustomEvent('pick', {
          detail: this.filteredData[idx],
        }),
    )
    if (skipRender !== false) {
      this.doRender()
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
    this.doRender()
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
    const S = this.root.querySelector("slot[name='input']")! as HTMLSlotElement;
    const fields = S.assignedElements().filter(x => x.tagName.toLowerCase() === "input");
    if(fields.length) {
      return fields[0];
    } else {
      return S.children[0]
    }
  }

  rightButton = createRef<HTMLButtonElement>();

  afterRender(childrenChanged: boolean) {
    super.afterRender(childrenChanged);

    if(!this.input.hasAttribute("data-veef-search")) {
      Object.entries(this.getHandlers()).map(([k, v]) => {
        this.input.addEventListener(k.toLowerCase().substring(2), v)
      });
      this.input.setAttribute("data-veef-search", 1)
    }
    const autoList = document.querySelector("#autolist")
    if(autoList) {
      autoList.scrollIntoView()
    }
  }

  loadData() {
    const data = [...this.querySelectorAll("datalist")];
    if(data.length > 0) {
      let newdata: {label: string, value: string}[] = [];
      data.forEach(x => {
        [...x.querySelectorAll("option")].map(x => {
          newdata.push({
            label: x.innerText,
            value: x.getAttribute("value") || x.innerText
          })
        })
      })
      this._data = newdata
      this._itemKey = "label"
      this._itemToText = (o: object) => (o as {label: string}).label
    }
  }

  getHandlers() : Record<string, (e: Event) => void> {
    return Object.fromEntries(['onInput', 'onChange', 'onBlur', 'onFocus', 'onContextMenu', 'onSelect', 'onKeyUp', 'onKeyDown', 'onKeyPress']
        .map(ev => {
          return [ev, (e: Event) => this.handleNativeInput(e)]
        }));
  }
  public hideSuggestions = false
  render() {
    this.loadData()
    return (
        <div className='flex flex-col relative input-wrapper-root'>
          <div part="input-wrapper" className='flex input-wrapper imp'>

            <slot name={"input"} id={"__veef_search_input"}>
              <input {...this.getHandlers()} data-veef-search={"1"} placeholder={this._placeholder} />
            </slot>

            <button ref={this.rightButton} part="right-button"
                    className='cursor-pointer w-auto flex rounded-r justify-end items-center text-blue-500 p-2 hover:text-blue-400 right-button'>
              <slot name="icon">
                <v-icon className='text-blue-500' name='Search'></v-icon>
              </slot>
            </button>
          </div>

          {this.autocomplete()}
        </div>
    );
  }

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
          part={"complete-list-item" + (active ? " complete-item-active" : "") + (props.last ? " complete-item-last" : "")}
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

    if(this._itemKey) {
      optList = this.fuzzyRenderer(WindiItem)
    } else {
      optList = this.filteredData.map((x, idx) => {
        return <WindiItem last={idx + 1 == this.filteredData.length} idx={idx}>{this._itemRender(x, <></>)}</WindiItem>
      })
      // optList = this._itemRender(this.filteredData, null)
    }

    return <div
        id='autolist' part="complete-list-wrapper" style="z-index: 35"
        class='absolute top-9 w-full border-t-1 border-gray-300 border-solid bg-white shadow-lg'
    >
      <ul
          role='listbox'
          part={"complete-list"}
          aria-labelledby='listbox-label'
          aria-activedescendant='listbox-item-3'
          class='suggestion-list max-h-56 rounded-b-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'
      >
        {optList}
      </ul>
    </div>
  }
}