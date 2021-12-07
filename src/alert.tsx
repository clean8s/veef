import React from 'react'
import { render, alertCss, renderWithCss } from './style'
import { Slottable, TmSlot } from './slottable'
import tabStyle from '../icons/tabs.css';

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