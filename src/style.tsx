import React from 'react'
import windiCss from 'virtual:windi'
import vendorCss from '../icons/vendor.css'
import alertCss from '../icons/alert.css'

export {vendorCss, alertCss, windiCss};

import { render as preactRender } from 'preact'
import { fnCall, fnCallSetup } from './slottable';

export function genCss(classes: string) {
  function escapeRegex(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
  let cls = classes.split(' ');
  cls.push("*", "html", "::after");
  return cls.map(x => {
    let rgx = new RegExp(escapeRegex(x) + "\\s*{(.*?)}", 's');
    let oo = windiCss.match(rgx);
    if(oo && oo[1]) return oo[1];
    return null
  }).filter(x => x != null).join("\n")
}

const renderChain: typeof preactRender = (x, y) => {
  preactRender(<>
  {x}
  <slot name="h"></slot>
  <slot name="style"></slot>
  </>, y);
  const thisBind = (y as ShadowRoot).host;
  const hSlot = y.querySelector(`slot[name="h"]`) as HTMLSlotElement;
  const styleEl = y.querySelector("#_global_v_style") as HTMLStyleElement;

  hSlot.addEventListener('slotchange', (e) => {
    const slotEls = hSlot.assignedNodes();
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
  // if(supportsStyles()) {
  //   //@ts-ignore
  //   (y as ShadowRoot).adoptedStyleSheets = adoptedSheets
  //   renderChain(x, y);
  //   return
  // }
  // renderChain(
  //   <>
  //     <style>{objCss}</style>
  //     {x}
  //   </>,
  //   y,
  // )
  renderWithCss("")(x, y)
}