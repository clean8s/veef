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


export class Code extends TmSlot {
  root: HTMLElement
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
    this.render()
  }

  /**Given a Node.textContent, de-indents the
   * source code such that you can freely indent your HTML:
   * <code>
   *    const x = 1          <=>    <code>const x = 1</code>
   * </code>
   */
  dedent(code: string) : string {
    let nonSpace = [...code].findIndex(x => !x.match(/\s/));
    if (nonSpace === -1) {
      // No non-space characters
      return code
    }

    // The first newline is considered redundant
    // because source usually looks like this:
    //
    // <code>
    // code begins here
    // </code>
    if(code.startsWith('\n')) { 
      code = code.substring(1);
      nonSpace--;
    }
    
    const weight = (spc: string): number => {
      return spc.split('').reduce((acc, x) => {
        if (x === '\t') acc+= 4;
        else if(x.match(/\s/)) acc++;
        return acc
      }, 0)
    };

    const detectedSpace = code.substring(0, nonSpace);
    const detectedWeight = detectedSpace.split('\n').reduce((acc, x) => {
        if (weight(x) > acc) acc = weight(x);
        return acc
      }, 0);
    
    // const detectedWeight = weight(detectedSpace);

    const restString = code.substring(nonSpace);
    return restString.split("\n").map(x => {
      for(let i = 0; i < detectedWeight; i++) {
        if(x.length > 0 && x[0].trim().length === 0) {
          if(x[0] === '\t') {
            i += 3;
          }
          x = x.substring(1);
        }
      }
      return x;
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

  render() {
    preactRender(
      <>
      <div style="display: none"><slot></slot></div>
      <style>{codeCss}</style>
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

import {render as preactRender} from 'preact'

import codeCss from './icons/syntax-hl.css'