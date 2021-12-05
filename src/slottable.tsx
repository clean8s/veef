import htm from 'htm'
import { h as preactH } from 'preact'
import { bool } from 'prop-types'
import { SyntheticEvent } from 'react'
import { render } from './style'
//@ts-ignore
export const html = htm.bind(preactH)

export type Component<T> = React.ReactElement<T>
export type VNode = React.ReactNode

/** Evaluates JS source in a transpiler-safe way:
 it only exposes a single variable named 'h'
 which is the htm function from the htm library.
 Note: this still means executing arbitrary code.
*/
export function fnCall(bindThis: any, source: string, ...args: any[]): any {
  return new Function('h', 'args', `let code = ${source}; return code(...args)`).bind(bindThis)(args)
}

/** Same as fnCall except it always calls f(h) 
 * where h is preact/htm 
 */
export function fnCallSetup(bindThis: any, source: string) : any {
  return new Function('h', `let code = (${source}); return code(h)`).bind(bindThis)(html)
}

export function rawExecute(bindThis: any, source: string) : any {
  return new Function('h', source).bind(bindThis)(html)
}

export function literalOrString(src: string) : string | boolean | number | object {
  if (typeof src === 'string' && src.trim().length === 0) {
    return true
  } else {
    try {
      return JSON.parse(src)
    } catch (e) {
      console.error(e)
    }
    return src
  }
}

// type Q<T> = new () => T extends HTMLElement ? T : never;
export function Attrs<T extends new (...m: any[]) => HTMLElement >(attrList: string[], handler: (attr: string, from: string, to: string) => void) {
  return (cls: T) : any => {
    //@ts-ignore
    cls.observedAttributes = attrList;
    cls.prototype.attributeChangedCallback = function (attr: string, from: string, to: string) {
      handler(attr, from, to)
    };
    class newClass extends cls {
      constructor(...args: any[])  {
        super(...args)
      }
      setupSuper(k: string, v: any) {
        //@ts-ignore
        super[k] = v;
        //@ts-ignore
        super.render()
      }
    };
    cls.prototype.props.map(x => {
      Object.defineProperty(newClass.prototype, x.substring(1), {
        get() {
          return this[x];
        },
        set(val: any) {
          this.setupSuper(x, val)
        }
      })
    })
    return newClass
  }
}

import React from 'react'
type SlotEvent = {target: EventTarget & HTMLSlotElement | null}
type SlotCallback = () => void;

export class Slottable extends HTMLElement {
  slotSetup(root: HTMLElement, updateCb: SlotCallback) {
    let slots = [...root.querySelectorAll('slot')];
    slots.map(slot => {
      slot.addEventListener('slotchange', e => this.handleSlot(e as SlotEvent, updateCb))
      this.handleSlot({ target: slot }, updateCb)
    })
  }

  slottedNodes: Map<string, { elements: HTMLElement[], texts: Text[]}> = new Map();

  public slottedAny(slotName: string): HTMLElement[] {
    const nodes = this.slottedNodes.get(slotName)
    if(typeof nodes === 'undefined') return [];
    return nodes.elements;
  }

  public slottedByTag<T extends HTMLElement>(slotName: string, tagName: string) : T[] {
    const filtered = this.slottedAny(slotName).filter(x => x.tagName.toLowerCase() === tagName.toLowerCase());
    return filtered as T[];
  }


  handleSlot(e: SlotEvent, fn: SlotCallback) {
    const slot = e.target
    if(slot === null) return;
    const slottedTexts: Text[] = slot.assignedNodes({flatten: true}).filter(x => x.nodeType === Node.TEXT_NODE) as Text[]
    const slottedEls: HTMLElement[] = slot.assignedElements({flatten: true}) as HTMLElement[];
    this.slottedNodes.set(slot.name, {
      elements: slottedEls,
      texts: slottedTexts,
    })
    requestAnimationFrame(() => fn())
  }

  public htm(fn: (h: any)=>any) {
    return fn(html);
  }
  
    /**Parse attribute string to a likely more useful thing.
   * basic JS literals get JSON.parse'd, empty attribute
   * is considered a flag and is returned as true.
  */
     attributeChangedCallback(key: string, _: any, newVal: string) {
       const props = Object.getPrototypeOf(this);
       const names = Object.getOwnPropertyNames(props);
       const prop = names.find(x => x.toLowerCase() === key);
       
    console.log(prop)
       if(!prop) {
         return
       }
       
      if (typeof newVal === 'string' && newVal.trim().length === 0) {
        //@ts-ignore
        this[prop] = true
      } else {
        let err = false;
        let jVal = newVal.trim()
        try {
          jVal = JSON.parse(newVal)
        } catch (e) {
          err = true;
        }
        if(!err) {
          //@ts-ignore
          this[prop] = jVal;
        } else {
          //@ts-ignore
          this[prop] = fnCallSetup(this, `(h) => (${newVal.trim()})`)
        }
      }
    }
}

/** A custom Element that handles slotting templates. */
export abstract class TmSlot extends HTMLElement {
  static isTemplate(x: HTMLElement) {
    return x.tagName.toLowerCase() === 'template'
  }

  public htm(fn: (h: any)=>any) {
    return fn(html);
  }
  
  slotSetup(root: HTMLElement, updateCb: () => void) {
    let slots = [...root.querySelectorAll('slot')]
    slots.map(slot => {
      slot.addEventListener('slotchange', e => this.handleSlot(e, updateCb))
      this.handleSlot({ target: slot }, updateCb)
    })
  }
  
  templates: Record<string, HTMLElement[]> = {}
  
  getSlotted<T extends HTMLElement>(slotName: string): T[] {
    if (slotName in this.templates) {
      return this.templates[slotName] as T[]
    }
    return []
  }
  
  private handleSlot(e: Event | { target: HTMLSlotElement }, updateCb: () => void) {
    const slot = e.target as HTMLSlotElement
    
    const slottedEls: HTMLElement[] = slot.assignedNodes().filter(x => x.nodeType == Node.ELEMENT_NODE) as HTMLElement[]
    
    let classicEl = slottedEls.find(x => x.tagName.toLowerCase() == 'script') as HTMLElement | undefined
    let others = slottedEls.filter(x => x.tagName.toLowerCase() != 'script') as HTMLElement[]
    if (typeof others != 'undefined') {
      this.templates[slot.name] = others
      // TODO: do we want to call an update?
      // when? immediately or reqAnimFrame?
      // updateCb()
      requestAnimationFrame(() => updateCb())
    }
    if (typeof classicEl != 'undefined') {
      let code = classicEl.textContent as string
      if (slot.name == 'setup') {
        new Function('html', `let code = ${code}; return code(html)`).bind(this)(html);
      }
    }
  }
  
  private getAttrList(): string[] {
    //@ts-ignore
    return this.constructor.observedAttributes
  }
  
  /**Parse attribute string to a likely more useful thing.
   * basic JS literals get JSON.parse'd, empty attribute
   * is considered a flag and is returned as true.
  */
  attributeChangedCallback(key: string, _: any, newVal: string) {
    let obsAttr: string[] = this.getAttrList()
    if (!obsAttr.find(x => x === key)) {
      return
    }
    if (typeof newVal === 'string' && newVal.trim().length === 0) {
      //@ts-ignore
      this[key] = true
    } else {
      let jVal = newVal
      try {
        jVal = JSON.parse(newVal)
      } catch (e) {}
      //@ts-ignore
      this[key] = jVal
    }
  }
}