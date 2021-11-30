import htm from 'htm'
import { VNode } from 'preact'
import { h as hh } from 'preact'
//@ts-ignore
const html = htm.bind(hh)

type InjectedArgs = any[]
type Renderer = (args: InjectedArgs) => VNode

function templateContent(t: HTMLTemplateElement): string {
  let nodeCopy = t.content.cloneNode(true)
  let code = nodeCopy.textContent as string
  code = code.trim()
  if (!code.startsWith('html`')) code = 'html`' + code + '`'
  return code
}

export function fnCall(source: string, ...args: any[]): any {
  return new Function('h', 'args', `let code = ${source}; return code(...args)`)(html, args)
}

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
      // updateCb()
      requestAnimationFrame(() => updateCb())
    }
    if (typeof classicEl != 'undefined') {
      let code = classicEl.textContent as string
      if (slot.name == 'setup') {
        new Function('args', `let code = ${code}; return code(...args)`)([html, this])
      } else {
        // this.templates[slot.name] = (args: InjectedArgs) => {
        //     code = code.trim();
        //     return new Function("x", `let code = ${code}; return code(...x)`)(args);
        // }
        // requestAnimationFrame(() => updateCb());
      }
    }
  }

  private getAttrList(): string[] {
    //@ts-ignore
    return this.constructor.observedAttributes
  }

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
