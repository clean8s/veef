import React, { createRef } from 'react'
import { render, alertCss, renderWithCss } from './style'
import { Slottable, TmSlot, html, rawExecute, Props, Attrs } from './slottable'
import {Portal, Transformable} from "./transformable"

@Props(["transform"], "doRender")
export class Dropdown extends Transformable {
  visible = false;
  blurTimeout: NodeJS.Timeout | null = null;

  toggle(visible: boolean, e?: PointerEvent) {
    if(!visible) {
      this.visible = false;
      this.doRender()
    } else {
      this.visible = true;
      const R = this.getBoundingClientRect();
      const viewportH = visualViewport.height;
      if(R.top > viewportH * 0.7) {
        window.scroll(0, window.scrollY + R.top - viewportH * 0.5);
      }
      console.log(R.top + 0.3 * viewportH, viewportH) 
      this.doRender()

      if(!(e.target instanceof HTMLButtonElement)) {
        this.root.querySelector("button")!.focus();
        e?.preventDefault();
      }
    }
  }

  selectedIdx = 0;

  pick(idx: number) {
    this.selectedIdx = idx;
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
  fixedWidth = 0;
  render() {
    // if(this.measureDiv.current) {
    //   this.measureDiv.current.style.display = "block"
    //   const R = this.measureDiv.current.getBoundingClientRect()
    //   this.measureDiv.current.style.display = "none"
    //   this.fixedWidth = Math.round(R.width);
    // }

    let btnStyle = "width: 14rem;"

    const hideStyle = this.visible ? "" : "display:none;"
    const btnKey = (kbdEvent: KeyboardEvent) => {
      if (kbdEvent.key === 'Enter' && this.visible) {
        this.selectedIdx = this.highlight;
        kbdEvent.preventDefault();
      }
      if (kbdEvent.key === 'ArrowDown') {
        this.highlight++;
        kbdEvent.preventDefault()
      }
      if (kbdEvent.key === 'ArrowUp') {
        this.highlight--;
        kbdEvent.preventDefault()
      }
      if (kbdEvent.key === 'Escape' && this.visible) {
        this.toggle(false, kbdEvent);
        kbdEvent.preventDefault()
      }
      this.highlight = this.highlight % this.virtual("option").length;
      if(this.highlight < 0) this.highlight += this.virtual("option").length;
      this.doRender()
    }
    return <>
          <div class="relative inline-block text-left">
          <div>
              <button onKeyDown={btnKey} part="select" type="button" onBlur={(e) => this.toggle(false, e)} onClick={(e) => this.toggle(true, e)}
              class="border border-gray-300 bg-white dark:bg-gray-800
              shadow-sm flex items-center justify-center w-full rounded-md
              px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:ring-opacity-30 focus:outline-none focus:ring-2 focus:ring-orange-600" id="options-menu">
                <this.Portal>
                  <div style="user-select:none;">{this.virtual("option").length > this.selectedIdx ? this._transform(this.virtual("option")[this.selectedIdx], this.selectedIdx) : ""}</div>
                </this.Portal>
                <v-icon name="Expand"></v-icon>
              </button>
          </div>
          <div style={hideStyle} part="box" class="origin-top-right py-1 z-40 absolute right-0 mt-[2px] w-56 rounded-md shadow-lg bg-white dark:bg-gray-800">
              <div style="max-height: 30vh; overflow-y: auto;">
              <div class="py-1 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <this.Portal>
                  {this.virtual("option").map((x, idx) => {
                    let maybeActive = {};
                    if(idx === this.highlight) {
                      maybeActive = { active: "true" }
                    }
                    let itemHov = () => {
                      if(idx == this.highlight) return;
                      this.highlight = idx;
                      this.doRender()
                    }
                    return <v-item tabIndex="0" {...maybeActive} onPointerOver={() => itemHov()} onPointerDown={() => this.pick(idx)}>{this._transform(x, idx)}</v-item>
                  })}
                </this.Portal>
              </div>
              </div>
          </div>
      </div>
    </>
  }
}