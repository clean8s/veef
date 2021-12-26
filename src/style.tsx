import React from 'react'
import windiCss from 'virtual:windi'
import vendorCss from '../icons/vendor.css'
import alertCss from '../icons/alert.css'

export {vendorCss, alertCss, windiCss};

import { render as preactRender } from 'preact'
import { fnCall, fnCallSetup } from './slottable';


let globalSlotReady : WeakMap<HTMLElement, boolean>;
if(typeof window["globalSlotReady"] == "undefined") {
  globalSlotReady = window["globalSlotReady"] = new WeakMap();
} else {
  globalSlotReady = window["globalSlotReady"];
}

const renderChain: typeof preactRender = (x, y) => {
  preactRender(<>
  {x}
  <slot name="script"></slot>
  <slot name="h"></slot>
  </>, y);
  const thisBind = (y as ShadowRoot).host;
  const scriptSlot = y.querySelector(`slot[name="script"]`) as HTMLSlotElement;
  const hSlot = y.querySelector(`slot[name="h"]`) as HTMLSlotElement;
  

  let lastTimeout: null | NodeJS.Timeout = null;
  if(!globalSlotReady.has(thisBind)) {
  hSlot.addEventListener("slotchange", (e) => {
    hSlot.assignedElements().map(x => {
      const src = x.textContent.trim();
      if(src?.endsWith("<") || src.endsWith("/") || src.endsWith(">")) {
        return;
      }
      fnCallSetup(thisBind, src)
      // }
    })
    // fnCallSetup()
  })
  globalSlotReady.set(thisBind, true);
  }
  

  scriptSlot.addEventListener('slotchange', (e) => {
    const slotEls = scriptSlot.assignedNodes();
    slotEls.map(x => {
      if(!(x instanceof HTMLTemplateElement)) return;
      // if(x.tagName.toLowerCase() !== 'template') return;
      if(x.content.textContent == null || x.content.textContent.trim().length == 0){
        const mut = new MutationObserver((e) => {
          const M = e.find(x => Array.from(x.addedNodes).find(x => x instanceof HTMLScriptElement));
          if(M) {
            fnCallSetup(thisBind, '(() => {' + x.content.textContent + '})')
            mut.disconnect();
          }
        });
        mut.observe(x.content, {attributes: true, characterDataOldValue: true, characterData: true, childList: true, subtree: true});
      } else {
          const newInstance = x.content.cloneNode(true) as HTMLElement;
          if(newInstance.textContent != null && newInstance.textContent.trim().length > 0) {
            fnCallSetup(thisBind, '(() => {' + newInstance.textContent.trim() + '})')
          }
        }
    })
  })
}

function genSpan() {
  Array.from(Array(9)).map((_, idx) => `*[is~="md-span-${idx}"] { --v-span: ${idx}; }`);
}
export const objCss = windiCss + vendorCss

function supportsStyles() {
  return 'adoptedStyleSheets' in Document.prototype &&
  'replace' in CSSStyleSheet.prototype;
}

let adoptedSheets: null | CSSStyleSheet[] = null;
if(supportsStyles()) {
  const fullSheet = new CSSStyleSheet();
  //@ts-ignore
  fullSheet.replace(objCss);
  adoptedSheets = [fullSheet]

  const mn = new CSSStyleSheet();
  mn.replace(vendorCss)
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, mn];
} else {
  const styleEl = document.createElement('style');
  styleEl.textContent = vendorCss;
  document.head.append(styleEl);
}


export const renderWithCss: ((css: string) => typeof preactRender) = (cssStr: string) => (x, y) => {
  if(supportsStyles()) {
    const thisSheet = new CSSStyleSheet();
    //@ts-ignore
    thisSheet.replace(cssStr);
    //@ts-ignore
    (y as ShadowRoot).adoptedStyleSheets = [...adoptedSheets, thisSheet];
    renderChain(x, y);
    return
  }

  renderChain(
    <>
      <style>{objCss}</style>
      <style>{cssStr}</style>
      {x}
    </>,
    y,
  )
}

/**Renders a component together with a stylesheet.
 * TODO: Use the Stylesheet API to prevent duplication. 
 */
 export const render: typeof preactRender = (x, y) => {
  renderWithCss("")(x, y)
}