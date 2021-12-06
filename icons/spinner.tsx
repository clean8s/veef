import React from 'react'
import { sized } from './lib/icons'

export const extraIcons = {
  'Spinner': SpinComponent,
}

export function SpinComponent(props: {}) {
  let SpinIcon = sized(spinnerSvg, { class: 'spinner', 'part': 'spinner' })
  return <>
    <SpinIcon />
  </>
}

const spinnerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
</svg>`

export const spinnerCss = `.spinner {
  animation: rotate 2s linear infinite;
}
.path {
  stroke: currentColor;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
`