import React from 'react'
import { render, alertCss, renderWithCss } from './style'
import { Slottable, TmSlot } from './slottable'
import tabStyle from '../icons/tabs.css';

export class Alert extends TmSlot {
  root: HTMLElement
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
  }

  connectedCallback() {
    this.render()
    if(this.hasAttribute('toast') && !this.alreadyToast) {
      this.toast()
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
    // this.root.querySelector("slot").addEventListener('slotchange', () => {
    //   if(this.toastTarget != null) {
    //     this.toastTarget.innerHTML = this.innerHTML
    //   }
    // })
  }

  toast() {
    this.alreadyToast = true;
    // this.removeAttribute('toast')
    // const M = this.cloneNode(true);
    // this.toastTarget = M;
    
    this.style.position = 'fixed';
    this.style.zIndex = '9999';
    this.style.left = '200px';
    this.classList.add("toast-before")
    this.root.querySelector("#alert").classList.add('toast');
    requestAnimationFrame(() => {
      this.classList.remove("toast-before")
    })
    //@ts-ignore
    let sq = window.slotQueue = ("slotQueue" in window ? [...window.slotQueue, this ] : [this]) as HTMLElement[];
    let top = 80;
    if(sq.length > 1) {
      top = sq[sq.length - 2].getBoundingClientRect().bottom + 15;
    }
    this.style.top = top + 'px';
    // document.body.appendChild(M)
  }

  alreadyToast = false;
  toastTarget = null;

  attributeChangedCallback(key: string, _: any, newVal: string) {
    if(key === 'toast' && !this.alreadyToast) {
      this.toast()
    }
    this.render()
  }

  static get observedAttributes() {
    return ['info', 'warning', 'success', 'error', 'toast']
  }
}