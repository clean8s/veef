import React from 'react'
import { render, renderWithCss } from './style'
import { Slottable, TmSlot } from './slottable'
import tabStyle from '../icons/tabs.css';

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
          <slot name="tab"></slot>
              </div>
              <div class="mx-[1px] p-2 border-1 border-[#ccc] rounded-b">
              <slot name=""></slot>
              </div>
        </>,
        this.root,
      )
      this.lastListeners.forEach((v, k) => {
          k.removeEventListener('click', v as any)
      })
      this.lastListeners = new Map();

      this.slottedAny("tab").map((all) => {
        const me = all;
        let lstn = (me: HTMLElement) => {
          return () => {
              this.tabTargetToggle(me)
          }
          };
          // this.lastListeners.set(all, lstn);
          all.addEventListener('click', lstn(me));
      })

      if(!this.hadFirst) {
        const content = this.slottedAny("");
        const tabs = this.slottedAny("tab");
        if(content.length > 0 && tabs.length > 0) {
          this.tabTargetToggle(tabs[0])
          this.hadFirst = true;
        }
        }

        this.slottedAny("").map((x, idx) => {
          if(idx != this.activeContentIdx) {
            x.style.display = 'none'
          }
        })
    }
    lastListeners: Map<HTMLElement, Function> = new Map();

    hadFirst = false;
  
  
    tabPosition(tab: HTMLElement) {
      return this.slottedAny("tab").findIndex(x => x.isEqualNode(tab));
    }
    // findTarget (tab: HTMLElement) {
    //   const trg = x.getAttribute("data-target");
    //   return trg != null ? 
    //     this.parentElement?.querySelector(trg) as HTMLElement : null;
    // }
    activeContentIdx = -1;
  
    tabTargetToggle (tab: HTMLElement) {
        const thisIdx = this.slottedAny("tab").findIndex(x => x.isEqualNode(tab));
        if(thisIdx === -1 )
        return;
        const els = this.slottedAny("");
        // if(els.length < th)
        if(thisIdx >= els.length) return;
        const tgt = els[thisIdx]
        this.activeContentIdx = thisIdx;
        if(typeof tgt == 'undefined') return;
        this.slottedAny("tab").map(x => x.classList.remove('active'))
        this.slottedAny("").map(x => x.style.display = 'none')
        
        tab.classList.toggle("active", true)
        this.hadFirst = true;
        tgt.style.display = 'block'
    }
  
    attributeChangedCallback(key: string, _: any, newVal: string) {
      this.render()
    }
  
    static get observedAttributes() {
      return ['via']
    }
  }
  
  