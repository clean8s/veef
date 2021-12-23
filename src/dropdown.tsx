import React, { createRef } from 'react'
import { render, alertCss, renderWithCss } from './style'
import { Slottable, TmSlot, html, rawExecute, Props, Attrs } from './slottable'
import {Portal, Transformable} from "./transformable"

export class VItem extends HTMLElement {
  root
  constructor() {
    super();
    this.root = this.attachShadow({mode: "open"})
    render(<button part="button" class="w-full text-left hover:bg-[#00000010] focus:outline-none appearance-none flex
    items-center block px-4 py-2 text-[1rem] text-gray-700 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600">
      <slot class="inline-block"/></button>, this.root)
  }
}
@Props(["transform"], "doRender")
export class Dropdown extends Transformable {
  visible = false;
  blurTimeout: NodeJS.Timeout | null = null;

  showTop = false;
  toggle(visible: boolean, e?: PointerEvent) {
    if(!visible) {
      if(this.matches(':focus-within')) return;
      this.root.querySelector(`div[part="box"]`)!.style.opacity = 0;

      this.visible = false;
      this.doRender()

    } else {
      this.root.querySelector(`div[part="box"]`)!.style.opacity = 1;
      this.visible = true;
      // const R = this.getBoundingClientRect();
      // const viewportH = visualViewport.height;
      this.showTop = false;

      this.doRender()
      const R = this.measureDiv.current!.getBoundingClientRect();

      this.showTop = true;
      this.doRender();

      const R2 = this.measureDiv.current!.getBoundingClientRect();

      if(R.height === R2.height) {
        this.showTop = R.bottom > visualViewport.height;
      } else {
        this.showTop = R2.height > R.height;
      }

      this.doRender();


      if(!(e.target instanceof HTMLButtonElement)) {
        this.root.querySelector("button")!.focus();
        e?.preventDefault();
      }
    }
  }

  selectedIdx = 0;
  measureProxy: React.RefObject<HTMLDivElement> = createRef();
  measureProxyHide = true;

  pick(idx: number) {
    this.selectedIdx = idx;
    this.visible = false;
    this.doRender()
    this.querySelector("select")!.selectedIndex = this.selectedIdx;
    this.querySelector("select")!.dispatchEvent(new Event("change"));
    this.dispatchEvent(new Event("change"))
  }
  
  _transform = (node: React.ReactChild, idx: number) => {
    return node;
  }

  highlight = 0;
  measureDiv = createRef<HTMLDivElement>()
  hideMeasure = false;

  afterRender(childrenChanged: boolean) {
    super.afterRender(childrenChanged)
    if(!childrenChanged) return;
    if(!this.measureProxy || !this.measureProxy.current) return;
    this.measureProxyHide = false;
    this.doRender()
    const R = this.measureProxy.current.getBoundingClientRect();
    console.log(R)
    this.itemsWidth = R.width;
    this.measureProxyHide = true;
    this.doRender()
  }
  itemsWidth = 0;
  render() {

    let topAuto: any = "", bottomAuto: any = "";

    let autocomplete = <div ref={this.measureDiv} style="opacity: 1;" part="box"
                            className={(this.visible ? "" : "hidden ") + (this.showTop ? "bottom-0 " : "") + "origin-top-right transition-opacity py-1 z-40 absolute right-0 mt-[2px] flex max-w-56 rounded-md shadow-lg bg-white dark:bg-gray-800"}>
      <div style="max-height: 30vh; overflow-y: auto;">
        <div className="py-1 divide-y divide-gray-100" role="menu" aria-orientation="vertical"
             aria-labelledby="options-menu">

            {this.virtual("option").map((x, idx) => {

              const active = this.highlight === idx;
              return <button
                  tabIndex="0"
                  onBlur={(e) => this.toggle(false, e)}
                  onClick={() => {
                    this.highlight = idx;
                    this.pick(idx);
                  }}
                  part={"button" + (active ? " button-active" : "")} className="text-left hover:bg-[#00000010] focus:outline-none focus:bg-[#00000010] appearance-none block w-full
    items-center px-4 py-2 text-[1rem] text-gray-700 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600">
                {this._transform(x, idx)}
              </button>
            })}

        </div>
      </div>
    </div>;
    if(this.showTop) {
      topAuto = autocomplete;
    } else {
      bottomAuto = autocomplete;
    }
    return <>
          <div class="relative">
            {topAuto}
          </div>

      <div class={"fixed top-[10%] left-[10%]" + (this.measureProxyHide ? " hidden": "")} ref={this.measureProxy}>
      {this.virtual("option").map((x, idx) => <div>{this._transform(x, idx)}</div>)}
      </div>

          <div class="relative inline-block text-left">
              <button part="select" type="button" onBlur={(e) => this.toggle(false, e)} onClick={(e) => this.toggle(true, e)}
              style={this.itemsWidth == 0 ? "" : `min-width: ${Math.round(this.itemsWidth)}px;`}
                      class="
              border border-gray-300 bg-white dark:bg-gray-800
              shadow-sm flex items-center justify-center w-full rounded-md
              px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:ring-opacity-30 focus:outline-none focus:ring-2 focus:ring-orange-600" id="options-menu">
                <this.Portal>
                  <div style="user-select:none;">{this.virtual("option").length > this.selectedIdx ? this._transform(this.virtual("option")[this.selectedIdx], this.selectedIdx) : ""}</div>
                </this.Portal>
                <v-icon name="Expand"></v-icon>
              </button>
      </div>
      <div class="relative">
        {bottomAuto}
      </div>
    </>
  }
}