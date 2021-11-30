import React from 'react'
import { sized } from './lib/icons'

export const extraIcons = {
  'Spinner': SpinComponent,
  'LikeAnim': LikeComponent,
}

export function SpinComponent(props: {}) {
  let SpinIcon = sized(spinnerSvg, { class: 'spinner' })
  return <>
    <style>{spinnerCss}</style>
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

export function LikeComponent(props: {}) {
  return <>
    <style>{heartCss}</style>
    <svg width='24' class='heart' height='24' viewBox='0 0 24 24'>
      <path
        d='M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z'
      >
      </path>
    </svg>
  </>
}

const heartSvg = `
<svg width="24" height="24" viewBox="0 0 24 24">
<path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
</svg>
`

const heartCss = `
.heart {
  animation: h 2s infinite;
  border-radius: 100%;
  padding: 5px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
@keyframes h {
  0% {
    transform: rotate(0deg);
    fill: currentColor;
    background: transparent;
  }
  20% {
    transform: rotate(360deg);
    fill: white;
    background: currentColor;
  }
  40% {
    transform: rotate(0deg);
    fill: currentColor;
    background: transparent;
  }
  100% {
    transform: rotate(0deg);
    fill: currentColor;
    background: transparent;
  }
}
`
