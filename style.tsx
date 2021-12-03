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
  <slot key="_h_slot" name="h"></slot>
  </>, y);
  const thisBind = (y as ShadowRoot).host;
  const hSlot = y.querySelector(`slot[name="h"]`) as HTMLSlotElement;
  hSlot.addEventListener('slotchange', (e) => {
    const slotEls = hSlot.assignedElements();
    if(hSlot.hasAttribute('data-vf-load') && slotEls.length > 0) return;
    slotEls.map(x => {
      fnCallSetup(thisBind, (x.textContent as string).trim())
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
    preactRender(x, y);
    return
  }

  preactRender(
    <>
      <style>{objCss}</style>
      <style>{cssStr}</style>
      {x}
    </>,
    y,
  )
}
