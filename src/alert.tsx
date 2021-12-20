import React, { createRef } from 'react'
import { render, alertCss, renderWithCss } from './style'
import { Slottable, TmSlot, html, rawExecute, Props, Attrs } from './slottable'
import {Ref, VNode, toChildArray } from 'preact'
import { createPortal, useEffect } from 'preact/compat'
import tabStyle from '../icons/tabs.css';
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
              <div style="max-height: 150px; overflow-y: auto;">
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

export class Dropdown2 extends Slottable {
  root: HTMLElement
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
    this.render()
    this.slotSetup(this.root, () => this.render())
  }

  isOpen = false;
  value: string | null = null
  render() {
    if(this.value === null) {
      const slt = this.slottedAny("");
      if(slt.length > 0)
      this.value = this.slottedAny("")[0].innerHTML!;
    }

    let overlayStyle = this.isOpen ? " " : "display: none";
    let trigger = (state: boolean, e?: PointerEvent) => {
      this.isOpen = state;
      this.render();
      if(e && this.querySelector("*[slot='hint']")!.contains(e.target)) {
        e?.preventDefault();
        this.root.querySelector("button")!.focus();
      }
    }

    const hdlClick = (e) => {
      this.value = e.target.closest("v-item").innerHTML;
      this.render()
    }

    const maybeHint = <span id="veefPicked" dangerouslySetInnerHTML={{__html: this.value || ""}}></span>;

    render(
      <div class="relative inline-block text-left">
        <style>{`::slotted()`}</style>
          <div>
              <button onBlur={() => trigger(false)} onClick={(e) => trigger(true, e)} type="button" class="border border-gray-300 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-solid-orange-600" style="--tw-outline-opacity: 0.3;" id="options-menu">
                  {maybeHint}
                  <slot name="Q"></slot>
                  <v-icon name="Expand"></v-icon>
              </button>
          </div>
          <div onPointerDown={hdlClick} style={overlayStyle} id="optwrap" class="origin-top-right py-1 z-40 absolute right-0 mt-[2px] w-56 rounded-md shadow-lg bg-white dark:bg-gray-800">
              <div style="max-height: 100px; overflow-y: auto;">
              <div class="py-1 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <slot></slot>
              </div>
              </div>
          </div>
      </div>
      , this.root)
  }
}
export class Alert extends Slottable {
  root: HTMLElement
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
  }

  connectedCallback() {
    this.render()
    if(this.hasAttribute('toast') && !this.alreadyToast) {
      this.putToast()
    }
  }

  set toast(val: boolean) {
    if(val) {
      this.setAttribute('toast', '')
    } else {
      this.removeAttribute('toast')
    }
  }

  alertType() {
    const typ = Alert.observedAttributes.find(x => this.getAttribute(x) != null);
    return typ ? typ : 'info'
  }

  render() {
    let icon = 'info'
    const currentType = this.alertType()

    if (typeof currentType != 'undefined') {
      icon = `${currentType[0].toUpperCase()}${currentType.substring(1)}`
    }
   
    render(
      <>
      <style>{alertCss}</style>
      <div class={currentType} id='alert'>
        <v-icon name={icon} class='flex-shrink-0 w-6 h-6 fill-current mx-2' />
        <div>
          <slot></slot>
        </div>
      </div></>,
      this.root,
    )
  }

  // A queue of toast messages shared so that they can stack across the viewport.
  get globalQueue() {
    let win = window as any;
    win["slotQueue"] = win["slotQueue"] || [];
    return win["slotQueue"] as HTMLElement[];
  }

  set globalQueue(els: HTMLElement[]) {
    let win = window as any;
    win["slotQueue"] = els;
  }

  // Converts the alert into a toast
  // TODO: Shadow Stylesheets and better positioning API
  putToast() {
    this.alreadyToast = true;
    this.style.position = 'fixed';
    this.style.zIndex = '9999';
    this.style.left = '10%';
    this.classList.add("toast-before")

    let duration = this._durationAttr;
    
    this.root.querySelector("#alert").classList.add('toast');
    requestAnimationFrame(() => {
      this.classList.remove("toast-before")
    })
    setTimeout(() => {
      if(duration != this._durationAttr) return;
      this.classList.add("toast-before");
    }, duration);
    setTimeout(() => {
      if(duration != this._durationAttr) return;
      this.globalQueue = this.globalQueue.filter(x => x != this);
      this.remove()
    }, duration + 150);
    //@ts-ignore
    // let top = 5;
    const getHeight = (x: HTMLElement) => {
      // return x.offsetTop;
      const rect = x.getBoundingClientRect();
      return rect.bottom - rect.top;
    }

    if(this.globalQueue.length > 0) {
      const lastEl = this.globalQueue[this.globalQueue.length - 1] as Alert;
      this.toastBottom = lastEl.toastBottom + getHeight(lastEl) + this.stackPadding;
    }
    // this.toastBottom = top;
    this.style.bottom = this.toastBottom + 'px';
    this.globalQueue.push(this);
  }

  alreadyToast = false;
  toastTarget = null;
  toastBottom = 0;
  stackPadding = 10;

  _durationAttr = 1500;
  attributeChangedCallback(key: string, _: any, newVal: string) {
    key = key.toLowerCase().trim()
    if(key === 'duration' && !isNaN(parseInt(newVal))) {
      this._durationAttr = parseInt(newVal)
      this.alreadyToast = false;
      this.putToast()
    }
    if(key === 'toast' && !this.alreadyToast) {
      this.putToast()
    }
    this.render()
  }

  static get observedAttributes() {
    return ['info', 'warning', 'success', 'error', 'toast', 'duration']
  }
}