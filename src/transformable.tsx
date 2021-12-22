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

  export abstract class Transformable extends HTMLElement {
    root: ShadowRoot;
    constructor() {
      super()
      this.root = this.attachShadow({mode: 'open'})
  
      this.Portal = (props: {children: any, target?: string, self?: Transformable}) =>{
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
  
    onChildrenChange() {
      [...this.children].map(x => {
        if(x.slot.startsWith("__veef_")) return;
        this.getVirtualChildren(x);
        new MutationObserver(() => {
          this.getVirtualChildren(x);
        }).observe(x, {childList: true, characterData: true, subtree: true})
      })
      this.doRender();
    }
  
    virtual(selector: string) {
      return [...this.querySelectorAll(selector)].map(x => {
        return elementToVirtual(x);
      })
    }

    getVirtualChildren(x: Element) {
      //@ts-ignore
      // let vnode = toChildArray ( html([x.innerHTML!]) ) as React.ReactChild[];
      // this.vchildren[0] = vnode;
  
      // this.vchildren[1] = [...x.children].map(x => { 
      //   //@ts-ignore
      //   return html([x.innerHTML!]);
      // }) as React.ReactChild[];
  
      // this.virtualChildren.set(x.tagName.toLowerCase(), vnode);
      this.doRender();
    }
  
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
      <div style="display:none"><slot ref={this.defaultSlot}/></div>
      {this.render()}
      </>, this.root)
  
      if(firstCall === true) {
        this.onChildrenChange();
        this.defaultSlot.current?.addEventListener("slotchange", () => {
          this.onChildrenChange();
        })
        firstCall = false;
      }
    }
  }