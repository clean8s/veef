import { renderWithCss } from './style'
import React from 'react'
import { TmSlot, Attrs } from './slottable'

import codeCss from '../icons/syntax-hl.css'

class ScriptSetup {
  attemptLoad = false;
  fullLoad = false;
  callbacks: (()=>void)[] = [];
  init(cb: ()=>void) {
    if (document.readyState === "complete") {
      this.initNow(cb)
    } else {
      window.addEventListener("load", () => this.initNow(cb));
    }
  }
  initNow(cb: ()=>void) {
    if(!this.attemptLoad) {
      this.scriptCreate();
    } else if(this.fullLoad) {
      cb();
    }
    window.addEventListener("monacoloaded", cb);
  }

  scriptCreate() {
    const s = document.createElement('script');
    s.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs/loader.min.js");
    s.setAttribute("defer", "");
    s.onload = () => this.onScriptLoad();
    document.head.append(s);
    this.attemptLoad = true;
  }
  onScriptLoad() {
    let winReq = (window as any).require;
    // if(typeof winReq != 'function') {
    //   setTimeout(() => onScriptLoad(false), 100);
    //   return
    // }
    winReq.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' }});
    winReq(["vs/editor/editor.main"], () => {
      this.fullLoad = true;
      window.dispatchEvent(new CustomEvent("monacoloaded"))
    });
  }
}

if(typeof window.MonacoSetup == 'undefined') {
  window.MonacoSetup = new ScriptSetup();
}

@Attrs(["value", "language", "highlight"])
export class CodeEditor extends HTMLElement {
  root: HTMLElement
  hl;
  mydiv;
  mainSlot;
  constructor() {
    super()
    this.root = this.attachShadow({mode: 'open'}) as any as HTMLElement;
    this.root.innerHTML = `
    <slot name='mydiv'></slot>
    <slot style="display:none;" data-veef='1'></slot>`
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
    let isInit = false;

    window.MonacoSetup.init(() => {
      const intr = setInterval(() => {
        const C = this.getBoundingClientRect();
        if(C.width == 0) return;
        clearInterval(intr);
          _init();
          isInit = true;
      }, 1000);
    //  new IntersectionObserver((x) => {
    //       x.map(y => {
    //         if(y.intersectionRatio > 0.1 && !isInit) {
    //           _init();
    //           isInit = true;
    //         }
    //       })
    //     }, {threshold: 1}).observe(this);
        const _init = () => {
          this.setAttribute("loaded", "true")
        //@ts-ignore
        monaco.editor.setTheme("vs-dark");
        let editor = monaco.editor.create(myDiv, {
          value: this._code,
          language: this._language,
          // theme: 'vs-dark',
          fontFamily: "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace",
          fontWeight: "normal",
          fontSize: 16,
          automaticLayout: true
        });


        this.editor = editor;

        editor.getModel().onDidChangeContent(() => {
          ["change", "input"].map(x => {
            this.dispatchEvent(new CustomEvent(x, {
              detail: this.value
            }));
          });
        });
      };
    });
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