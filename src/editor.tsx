import { renderWithCss } from './style'
import React from 'react'
import { TmSlot, Attrs } from './slottable'

import Prism from "prismjs"
import codeCss from '../icons/syntax-hl.css'
import { reduceEachLeadingCommentRange } from 'typescript'

@Attrs(["value", "language"])
export class Editor extends HTMLElement {
  root: HTMLElement
  constructor() {
    super()
    this.root = this;
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
    const s = document.createElement('script');
    // globalThis.exports = undefined;
    exports = undefined;

    const elTarget = this.root;

    s.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs/loader.min.js");
    s.setAttribute("async", "");

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
        
        editor.getModel().onDidChangeContent(() => {
          ["change", "input"].map(x => {
            this.dispatchEvent(new CustomEvent(x, {
              detail: this.value
            }));
          });
        });
        
      });
    }
    if(window.monacoLoaded !== true) {
      (window as any).monacoLoaded = true;
      s.onload = () => onScriptLoad(true);
      document.head.append(s);
    } else {
      onScriptLoad()
    }
  }
}