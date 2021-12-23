import React, { createRef } from 'react'
import { render, alertCss, renderWithCss } from './style'
import { Slottable, TmSlot, html, rawExecute } from './slottable'
import {Ref, VNode, toChildArray } from 'preact'
import { createPortal, useEffect } from 'preact/compat'

function elementToVirtual(el: Element) {
  const n = el.innerHTML;
    //@ts-ignore
    return html([n]) as React.ReactChild;
  }
  
  export function Portal (props: {children: any, target?: string, self: Transformable}) {
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
    constructor() {
      super()
      this.root = this.attachShadow({mode: 'open'})
  
      this.Portal = (props: {children: any, target?: string, self?: Transformable}) =>{
        return props.children;
        // return <v-virtual>{props.children}</v-virtual>
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
    
    makeVirtualSlot(tgtName: string) {
      tgtName = "__veef_" + tgtName;
      let alreadySlot = this.querySelector(`div[slot="${tgtName}"]`);
      if(alreadySlot) return alreadySlot;
      const div = document.createElement("div");
      div.slot = tgtName;
      this.append(div);
      return div;
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
      return [...this.querySelectorAll(selector)].map(x => {
        return elementToVirtual(x);
      })
    }

    // getVirtualChildren(x: Element) {
    //   this.doRender();
    // }
  
    virtualChildren: Map<string, React.ReactChild[]> = new Map();
    vchildren: Record<number, React.ReactChild[]> = {};
  
    vchild(depth: number) {
      return this.vchildren[depth] || []; 
    }
  
    defaultSlot = createRef<HTMLSlotElement>();
  
    abstract render(): VNode;

    counter = 0;
    doRender(firstCall?: boolean) {
      this.counter = 0;
      render(<>
      <slot style="display:none" ref={this.defaultSlot}/>
      {this.render()}
      </>, this.root)
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