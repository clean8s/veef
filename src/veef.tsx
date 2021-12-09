
import {Tabs } from "./tabs"
import { Alert } from './alert'
import { Code } from './codehl'
import { Dialog } from './dialog'
import { Table } from './table'
import { Tree } from './tree'
import {render as preactRender} from 'preact'
import { h as preactH } from 'preact'
import htm from 'htm'
export const html = htm.bind(preactH)


export {Tree, Dialog, Table, Alert, Code, Tabs, VeefElement};

export function loadComponents(extra: Record<string, CustomElementConstructor>) {
  customElements.define('v-tree', Tree)
  Object.entries(extra).forEach(([name, ctor]) => {
    customElements.define(name, ctor)
  })
  customElements.define('v-dialog', Dialog)
  customElements.define('v-table', Table)
  customElements.define('v-alert', Alert)
  customElements.define('v-code', Code);
  customElements.define('v-tabs', Tabs);

  customElements.define('v-controls', class extends HTMLElement {
    constructor() {
      super()
    }
  });

  customElements.define('v-scope', class extends HTMLElement {
    constructor() {
      super()
      this.root = this.attachShadow({mode: 'open'})
      const sl = document.createElement('slot')
      sl.addEventListener('slotchange', (e) => {
        const myEv = new CustomEvent<{slotEvent: any}>('slotnotify', {
          detail: {
          slotEvent: e
        }});

         const V = Array.from(this.children).filter(x => x.tagName.toLowerCase().startsWith('v-'));
         V.map(x => {
           x.dispatchEvent(myEv);
         })
      })
      this.root.append(sl)
    }

    root: ShadowRoot
  })
}

class VeefElement {
  static h = html;
}
setGlobal('VeefElement', VeefElement);

class Veef {
  static h = html;
  static with(fn: (h: typeof html)=>void) {
    return fn(html)
  }

  static render(expr: any, domElement: HTMLElement) {
    preactRender(expr, domElement)
  }

  static renderVirtual(expr: any) {
    const emptyEl = document.createElement("div");
    preactRender(expr, emptyEl)
    return Array.from(emptyEl.childNodes)
  }
}

setGlobal('Veef', Veef);

function setGlobal(key: string, value: any) {
    (window as Record<string, any>)[key] = value;
}