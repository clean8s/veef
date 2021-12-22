import { renderWithCss } from './style'
import React from 'react'
import { TmSlot, Attrs } from './slottable'

import codeCss from '../icons/syntax-hl.css'
import { reduceEachLeadingCommentRange } from 'typescript'

@Attrs(["value", "language", "highlight"])
export class Editor extends HTMLElement {
  root: HTMLElement
  hl;
  mydiv;
  mainSlot;
  constructor() {
    super()
    this.root = this.attachShadow({mode: 'open'}) as any as HTMLElement;
    this.root.innerHTML = `
    <code style='display:none' id='highlight'></code>
    <slot name='mydiv'></slot>
    <div style='display:none;'><slot data-veef='1'></slot></div>`
    this.hl = this.root.querySelector("#highlight");
    this.mydiv = this.root.querySelector("slot[name='mydiv']") as HTMLSlotElement;
    this.mainSlot = this.root.querySelector("slot[data-veef]") as HTMLSlotElement;
    this.mainSlot.addEventListener("slotchange", () => {
      const code = this.mainSlot.assignedNodes().filter(x => {
        return (x.nodeType === Node.TEXT_NODE) 
      }).map(x => x.textContent).join("");
      if(code.length > 0) {
        this.value = dedent(code);
      }
    })
  }

  slottedCode() {
    const code = this.mainSlot.assignedNodes().filter(x => {
      return (x.nodeType === Node.TEXT_NODE) 
    }).map(x => x.textContent).join("");
    return dedent(code);
  }

  editor: null | object = null;
  _code = "// Hello World!";
  _language = "javascript";

  _highlight = false;
  set highlight(a: boolean) {
    this._highlight = true;
    this.setAttribute("loaded", "true");
    let lastCode = ""
    setInterval(() => {
      let code = this.slottedCode();
      if(typeof monaco == 'undefined') return;
      if(lastCode === code) return;
      lastCode = code;
      console.log(code)
      
      if(this.editor !== null) {
        this.editor.dispose()
        this.editor = null;
      }
      this.querySelector("div[slot='mydiv']")!.setAttribute("data-lang", this._language);
      const mydiv = this.querySelector("div[slot='mydiv']")!;
      mydiv.innerHTML = "<pre data-lang='javascript' style='padding: 1rem; font-family: monospace; background: #333; font-size: 1rem; margin: 0; height: 100%;'></pre>"
      mydiv.children[0]!.textContent = code;
      this.style.minHeight = "0";
    // this.querySelector("div[slot='mydiv']").innerText = code;
    // this.hl?.setAttribute("data-lang", "javascript");
    // this.hl?.setAttribute("style", "")

    // this.root.setAttribute("data-lang", "javascript")
    monaco.editor.colorizeElement(this.querySelector("div[slot='mydiv'] pre"), {
      theme: "vs-dark"
    })
   }, 100);
    // console.log("A")
  }

  set language(s: string) {
    if(this.editor != null) {
      monaco.editor.setModelLanguage(this.editor.getModel(), s);
    }
    this._language = s;
  }

  get value(): string {
    if(this.editor == null) {
      return ""
    }
    return this.editor.getValue() as string;
  }

  set value(s: string) {
    if(this.editor != null) {
      this.editor.getModel().setValue(s);
    }
    this._code = s;
  }

  connectedCallback() {
    let myDiv = document.createElement("div");
    myDiv.slot = "mydiv"
    this.append(myDiv)
    // this.root = myDiv;

    const s = document.createElement('script');
    // globalThis.exports = undefined;
    // exports = undefined;

    const elTarget = myDiv;

    s.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs/loader.min.js");
    s.setAttribute("defer", "");

    const onScriptLoad = (doRequire?: boolean) => {
      let winReq = (window as any).require;
      if(typeof winReq != 'function') {
        setTimeout(() => onScriptLoad(false), 100);
        return
      }
      if(doRequire === true) {
        winReq.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' }});
      }

      winReq(["vs/editor/editor.main"], () => {
        if(this.hasAttribute("highlight")) return;
        let isInit = false;
        new IntersectionObserver((x) => {
          x.map(y => {
            if(y.intersectionRatio > 0.1 && !isInit) {
              _init();
              isInit = true;
            }
          })
        }, {threshold: 1}).observe(this);
        const _init = () => {
        //@ts-ignore
        monaco.editor.setTheme("vs-dark");
        let editor = monaco.editor.create(elTarget, {
          value: this._code,
          language: this._language,
          // theme: 'vs-dark',
          fontFamily: "monospace",
          fontSize: 16,
          automaticLayout: true
        });


        this.editor = editor;
        this.setAttribute("loaded", "true")
        
        editor.getModel().onDidChangeContent(() => {
          ["change", "input"].map(x => {
            this.dispatchEvent(new CustomEvent(x, {
              detail: this.value
            }));
          });
        });
      }
        
      });
    }

    const setup = () => {
      if(window.monacoLoaded !== true) {
        (window as any).monacoLoaded = true;
        s.onload = () => onScriptLoad(true);
        document.head.append(s);
      } else {
        onScriptLoad()
      }
    }
    if (document.readyState === "complete") {
      setup()
    } else {
      window.addEventListener("load", () => setup());
    }
  }
}

function dedent(code: string) : string {
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