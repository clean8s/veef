import React from 'react'
import { render, alertCss, renderWithCss } from './style'
import { Slottable, TmSlot } from './slottable'
import tabStyle from './icons/tabs.css';

export class Alert extends TmSlot {
  root: HTMLElement
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
  }

  connectedCallback() {
    this.render()
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

  attributeChangedCallback(key: string, _: any, newVal: string) {
    this.render()
  }

  static get observedAttributes() {
    return ['info', 'warning', 'success', 'error']
  }
}

export class Tabs extends Slottable {
  root: HTMLElement
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
  }

  connectedCallback() {
    this.render()
    this.slotSetup(this.root, () => this.render())
  }

  render() {
    renderWithCss(tabStyle)(
      <>
      <div id="" class="flex p-2 px-[1px] pb-0 space-x-1 border-b-1 border-[#ccc] bg-[#fff] rounded-t-xl" role="tablist" aria-orientation="horizontal">
        <slot name=""></slot>
            </div>
            <slot name="content"></slot>
      </>,
      this.root,
    )
    const tabs = this.root.firstChild as HTMLDivElement;
    Array.from(tabs.children).map(x => {
        x.classList.contains('sl-btn') ? x.remove() : 0;
    })

    this.slottedAny("").map((all, i) => {
      if(all.hasAttribute('data-veef-f1')) return;
      all.addEventListener('click', () => {
        this.slottedAny("").map((x, idx) => {
          this.tabTargetToggle(x, idx === i)
        })
      });
      all.setAttribute("data-veef-f1", "1")
    })
    this.slottedAny("")
    .map((x, idx) => {
      this.tabTargetToggle(x, idx === 0)
    })
  }


  findTarget (x: HTMLElement) {
    const trg = x.getAttribute("data-target");
    return trg != null ? 
      this.parentElement?.querySelector(trg) as HTMLElement : null;
  }

  tabTargetToggle (x: HTMLElement, desiredState: boolean) {
    const tgt = this.findTarget(x);
    if(tgt === null) return;

    const wantedState = desiredState;
    
    x.classList.toggle("active", wantedState)
    tgt.style.display = wantedState ? 'block' : 'none'
  }

  attributeChangedCallback(key: string, _: any, newVal: string) {
    this.render()
  }

  static get observedAttributes() {
    return ['via']
  }
}

