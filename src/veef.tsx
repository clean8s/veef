
import {Tabs, Tabs2} from "./tabs"
import { Alert } from './alert'
import {Dropdown, VItem} from './dropdown'
import { Dialog } from './dialog'
import { Table } from './table'
import { Tree } from './tree'
import {CodeEditor} from './codeEditor'
import {render as preactRender} from 'preact'
import { h as preactH } from 'preact'
import htm from 'htm'
export const html = htm.bind(preactH)

import {Search} from "./search";

export {Tree, Dialog, Table, Alert, Tabs, VeefElement, CodeEditor, Search};

class Reveal extends HTMLElement {
  getIdx() {
    const idx = [...document.querySelectorAll("v-reveal")].findIndex(x => x === this);
    return idx;
  }
  connectedCallback() {
    this.parentElement.setAttribute("closed", "true")
    if(window.history.state != null && window.history.state[`__reveal_${this.getIdx()}`] === "1") {
      this.toggle(true)
    }
    this.addEventListener("click", () => this.toggle())
  }
  stateSet(val: string) {
    const S = window.history.state || {};
    S[`__reveal_${this.getIdx()}`] = val
    //@ts-ignore
    window.history.replaceState(S, "", window.location)
  }
  lastPos: number  = 0
  toggle(newState?: boolean) {
      let isClosed = this.parentElement.hasAttribute("closed");
      if(newState === true) {
        isClosed = true;
      }

      if(isClosed) {
        this.getBoundingClientRect()
        this.lastPos = document.documentElement.scrollTop

        this.parentElement.removeAttribute("closed")
        this.stateSet("1")
      } else {
        this.parentElement.setAttribute("closed", "true")
        this.stateSet("0")

        this.getBoundingClientRect()
        window.scrollTo(0, this.lastPos)
      }
  }
}
function getPosition(element: Element) {
  var clientRect = element.getBoundingClientRect();
  return {left: clientRect.left + document.body.scrollLeft,
    top: clientRect.top + document.body.scrollTop};
}

export function loadComponents(extra: Record<string, CustomElementConstructor>) {
  customElements.define('v-tree', Tree)
  Object.entries(extra).forEach(([name, ctor]) => {
    customElements.define(name, ctor)
  })
  // customElements.define('v-item', VItem);
  customElements.define('v-dialog', Dialog)
  customElements.define('v-table', Table)
  customElements.define('v-alert', Alert)
  customElements.define('v-tabs', Tabs);
  customElements.define('v-code', CodeEditor);
  customElements.define('v-dropdown', Dropdown);
  customElements.define('v-search', Search);
  customElements.define('v-reveal-btn', Reveal)

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