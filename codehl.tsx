import { renderWithCss } from './style'
import React from 'react'
import { TmSlot } from './slottable'
//@ts-ignore
import Prism from "prism-es6"
import codeCss from './icons/syntax-hl.css'

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
      renderWithCss(codeCss)(
        <>
        <div style="display: none"><slot></slot></div>
        <pre>
        <code id='code'>
  
        </code>
        </pre>
        </>,
        this.root,
     )
     const codeEl = this.root.querySelector('#code');
     const slot = this.root.querySelector('slot')
     if(codeEl === null || slot === null) {
       return
     }
     slot.addEventListener('slotchange', e => {
      const langClass = `language-${this._lang}`
      let code = this.dedent(this.textContent || "")
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
  