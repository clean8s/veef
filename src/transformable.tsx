import React, { createRef } from 'react'
import { render, alertCss, renderWithCss } from './style'
import { Slottable, TmSlot, html, rawExecute } from './slottable'
import {Ref, VNode, toChildArray } from 'preact'
import { createPortal, useEffect } from 'preact/compat'

export function strToNode(s: string) {
  return html([s]) as React.ReactChild;
}

function elementToVirtual(el: Element) {
  let H = el.innerHTML
  // if(el instanceof HTMLTemplateElement) {
  //   H = (el.content.cloneNode(true) as HTMLElement).
  // }
  // console.log(H)
  // console.log()
  // const n = el.innerHTML.replaceAll(/<([^\s]+)((.+?)<\/\1>)/gsm, (x, y, z) => {
  //   if(z.indexOf("data-id") == -1)
  //   return `<${y} data-id="${Math.random().toString(16).substring(3)}" ${z}`
  //   return x;
  // });
    //@ts-ignore
    return html([H]) as React.ReactChild;
  }

  class Virtual extends HTMLElement {
  root
  constructor() {
    super();
    this.root = this.attachShadow({mode: "open"})
    this.root.innerHTML = "<slot></slot>"
  }
  }
  try {
    customElements.define("v-virtual", Virtual)
  }catch (e) {

  }
  
  export abstract class Transformable extends HTMLElement {
    root: ShadowRoot;
    constructor(customSlot?: boolean) {
      super()
      this.root = this.attachShadow({mode: 'open'})
      if(customSlot === true) this.__customSlot = true;
  
      this.Portal = (props: {children: any, target?: string, self?: Transformable}) =>{
        return props.children;
        if(!props.self) {
          props.self = this;
        }
        let out = ""
        if(!props.target) {
          out = props.self.counter.toString();
          props.self.counter++;
        } else {
          out = props.target;
        }
        return <>
        {createPortal(props.children, props.self.makeVirtualSlot(out))}
        <slot name={"__veef_" + out} />
        </>
      }
    }
  
    Portal;
  
    connectedCallback() {
      this.doRender(true)
    }

    observers: MutationObserver[] = [];
    onChildrenChange() {
      this.observers.map(x => x.disconnect());
      this.observers = [...this.children].map(x => {
        if(x.slot.startsWith("__veef_")) return;
        const obs = (new MutationObserver(() => {
          this.doRender();
        }));
        obs.observe(x, {childList: true, characterData: true, subtree: true})
        return obs;
      }).filter(x => x instanceof MutationObserver) as MutationObserver[];
      this.doRender();
    }

    afterRender(childrenChanged: boolean) : void {
      this.__inside_afterRender = true;
    }

    private __inside_afterRender = false;
    private __childrenChanged = false;

    virtual(selector: string) {
      return [...this.querySelectorAll(selector)].map((x, idx) => {
        return elementToVirtual(x);
      })
    }

    virtualChildren: Map<string, React.ReactChild[]> = new Map();
    vchildren: Record<number, React.ReactChild[]> = {};
  
    vchild(depth: number) {
      return this.vchildren[depth] || []; 
    }
  
    defaultSlot = createRef<HTMLSlotElement>();
    jsxSlot = createRef<HTMLSlotElement>();
  
    abstract render(slot?: React.ReactNode): VNode;

    private __customSlot = false;

    counter = 0;

    doRender(firstCall?: boolean) {
      this.counter = 0;
      const slotElement = <slot ref={this.defaultSlot}/>;
      let slotOutput: React.ReactNode = null
      if(this.__customSlot) {
        slotOutput = this.render(slotElement)
      } else {
        slotOutput = <>
          <div style={"display:none;"}>{slotElement}</div>
          {this.render()}
        </>
      }
      render(slotOutput, this.root)
      if(!this.__inside_afterRender) {
        this.afterRender(this.innerHTML == this.lastInner)
        this.lastInner = this.innerHTML
        this.__inside_afterRender = false;
      }
  
      if(firstCall === true) {
        this.onChildrenChange();
        this.defaultSlot.current?.addEventListener("slotchange", () => {
          this.onChildrenChange();
        })
        firstCall = false;
      }
    }
    lastInner = ""
  }