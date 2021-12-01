import React from 'react'
import windiCss from 'virtual:windi'
import vendorCss from './icons/vendor.css'
import alertCss from './icons/alert.css'

export {vendorCss, alertCss, windiCss};

import { render as preactRender } from 'preact'


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
    preactRender(x, y);
    return
  }
  preactRender(
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
