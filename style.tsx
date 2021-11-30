import React from 'react'
import windiCss from 'virtual:windi'
import mainCss from './icons/vendor.css'
import alertCss from './icons/alert.css'

export {mainCss, alertCss, windiCss};

import { render as preactRender } from 'preact'


export const objCss = windiCss + mainCss

/**Renders a component together with a stylesheet.
 * TODO: Use the Stylesheet API to prevent duplication. 
 */
export const render: typeof preactRender = (x, y) => {
  preactRender(
    <>
      <style>{objCss}</style>
      {x}
    </>,
    y,
  )
}
