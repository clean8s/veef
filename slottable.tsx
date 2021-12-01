import htm from 'htm'
import { h as preactH } from 'preact'
import { SyntheticEvent } from 'react'
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
  return new Function('h', `let code = ${source}; return code(h)`).bind(bindThis)(html)
}

type SlotEvent = {target: EventTarget & HTMLSlotElement | null}
type SlotCallback = () => void;

export abstract class Slottable extends HTMLElement {
  slotSetup(root: HTMLElement, updateCb: SlotCallback) {
    let slots = [...root.querySelectorAll('slot')];
    slots.map(slot => {
      slot.addEventListener('slotchange', e => this.handleSlot(e as SlotEvent, updateCb))
      this.handleSlot({ target: slot }, updateCb)
    })
  }

  slottedNodes: Map<string, { elements: HTMLElement[], texts: Text[]}> = new Map();

  public slottedElements<T extends HTMLElement>(slotName: string): T[] {
    if(this.slottedNodes.has(slotName)) {
      return this.slottedNodes.get(slotName)?.elements as T[];
    }
    return [];
  }

  handleSlot(e: SlotEvent, fn: SlotCallback) {
    const slot = e.target
    if(slot === null) return;
    
    const slottedTexts: Text[] = slot.assignedNodes().filter(x => x.nodeType === Node.TEXT_NODE) as Text[]
    const slottedEls: HTMLElement[] = slot.assignedNodes().filter(x => x.nodeType == Node.ELEMENT_NODE) as HTMLElement[]
    this.slottedNodes.set(slot.name, {
      elements: slottedEls,
      texts: slottedTexts
    })
    requestAnimationFrame(() => fn())
  }
}

/** A custom Element that handles slotting templates. */
export abstract class TmSlot extends HTMLElement {
  static isTemplate(x: HTMLElement) {
    return x.tagName.toLowerCase() === 'template'
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
