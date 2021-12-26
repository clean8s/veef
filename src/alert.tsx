import React, { createRef } from 'react'
import { render, alertCss, renderWithCss } from './style'
import { Slottable, TmSlot, html, rawExecute, Props, Attrs } from './slottable'
import {Ref, VNode, toChildArray } from 'preact'
import { createPortal, useEffect } from 'preact/compat'
import tabStyle from '../icons/tabs.css';
import {Portal, Transformable} from "./transformable"

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
    const typ = Alert.observedAttributes.filter(x => x !== "toast" && x !== "duration").find(x => this.getAttribute(x) != null);
    return typ ? typ : 'basic'
  }

  render() {
    let icon = 'Info'
    const currentType = this.alertType()

    if (typeof currentType != 'undefined' && currentType != 'basic') {
      icon = `${currentType[0].toUpperCase()}${currentType.substring(1)}`
    }

    let iconElement: React.ReactNode = <v-icon name={icon} className='flex-shrink-0 w-6 h-6 fill-current mr-2'/>;
    // if(this.hasAttribute("simple")) {
    //   iconElement = null;
    // }
    render(
      <>
      <style>{alertCss}</style>
      <div class={currentType} id='alert'>
        {iconElement}
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