import React from 'react'
import { render, alertCss } from './style'
import { TmSlot } from './slottable'

import Prism from "prism-es6"

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

import {prismCss} from './syntaxh/theme';


export class Code extends TmSlot {
  root: HTMLElement
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
    this.render()
  }

  dedent(code: string) {
    let spc = [...code].findIndex(x => !x.match(/\s/));
    if (spc == -1) {
      return code
    }
    if(code.startsWith('\n')) { 
      code = code.substring(1);
      spc--;
    }
    
    const b = code.substring(0, spc);
    const b2 = b.substring(b.lastIndexOf('\n') + 1);
    return code.split("\n").map(x => {
      return x.replace(b, "").replace(b2, "")
    }).join("\n").trim()
  }

  htmlify(code: string) {
    let out = '';
    let opened = false;
    while(1) {
      let t = code.indexOf('~');
      if(t == -1) {
        out += code;
        break;
      } else {
        out += code.substring(0, t);
        out += opened ? '>' : '<';
        opened = !opened;
        code = code.substring(t + 1);
      }
    }
    return out
  }


  // connectedCallback() {
  //   this.render()
  //   this.slotSetup(this.root, () => this.render())
  // }

  render() {
    render(
      <>
      <div style="display: none"><slot></slot></div>
      <style>{prismCss}</style>
      <pre>
      <code id='code'>

      </code>
      </pre>
      </>,
      this.root,
   )
   const codeEl : HTMLElement = this.root.querySelector('#code');
   this.root.querySelector('slot').addEventListener('slotchange', e => {

    const langClass = `language-${this._lang}`
    let code = this.dedent(this.textContent)
    if(this._lang === 'html') {
      code = this.htmlify(code)
    }
    codeEl.textContent = code;
    codeEl.setAttribute('class', langClass)
    Prism.highlightElement(codeEl, false);
   })
  }

  private _lang = "javascript"

  get lang() {
    return this._lang
  }

  set lang(l: string) {
    this._lang = l.trim();
  }

  static get observedAttributes() {
    return ['lang']
  }
}
