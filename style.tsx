import React from 'react'
import windiCss from 'virtual:windi'
import vendorCss from './icons/vendor.css'
import alertCss from './icons/alert.css'

export {vendorCss, alertCss, windiCss};

import { render as preactRender } from 'preact'
import { fnCall, fnCallSetup } from './slottable';

const renderChain: typeof preactRender = (x, y) => {
  preactRender(<>
  {x}
  <slot key="_v_htm" name="h"></slot>
  <slot key="_v_style" name="style"></slot>
  <style id="_global_v_style"></style>
  </>, y);
  const thisBind = (y as ShadowRoot).host;
  const hSlot = y.querySelector(`slot[name="h"]`) as HTMLSlotElement;
  const styleSlot = y.querySelector('slot[name="style"]') as HTMLSlotElement;
  const styleEl = y.querySelector("#_global_v_style") as HTMLStyleElement;

  styleSlot.addEventListener('slotchange', (e) => {
    const S = styleSlot.assignedElements().filter(x => x.tagName.toLowerCase() === 'template')
      .map(x => (x as HTMLTemplateElement).content.textContent).join("\n");
      styleEl.textContent = S;
  })
  hSlot.addEventListener('slotchange', (e) => {
    const slotEls = hSlot.assignedElements();
    hSlot.assignedNodes().map(x => {
        if(x instanceof HTMLTemplateElement) {
          if(x.content.textContent != null) {
            fnCallSetup(thisBind, x.content.textContent.trim())
          }
        }
    })
    if(hSlot.hasAttribute('data-vf-load') && slotEls.length > 0) return;
    slotEls.map(x => {
      if(x instanceof HTMLTemplateElement) return;
      let source = ""
      // console.log(x, x instanceof HTMLTemplateElement)
      if(x.textContent === null) {
        source = ""
      } else {
        source = x.textContent
      }
      if(source.trim().length === 0) {
        console.error("Cannot parse your code at ", hSlot.getRootNode().host)
        source = "()=>0"
      }
      fnCallSetup(thisBind, source.trim())
    });
    hSlot.setAttribute('data-vf-load', "1");
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

/**Renders a component together with a stylesheet.
 * TODO: Use the Stylesheet API to prevent duplication. 
 */
export const render: typeof preactRender = (x, y) => {
  if(supportsStyles()) {
    //@ts-ignore
    (y as ShadowRoot).adoptedStyleSheets = adoptedSheets
    renderChain(x, y);
    return
  }
  renderChain(
    <>
      <style>{objCss}</style>
      {x}
    </>,
    y,
  )
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
