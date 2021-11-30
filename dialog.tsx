import React from 'react'
import { render } from './style'
import { TmSlot } from './slottable'

export class Dialog extends TmSlot {
  root: HTMLElement

  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open', delegatesFocus: 'true' }) as any as HTMLElement
  }

  static get observedAttributes() {
    return ['open']
  }

  get open(): boolean {
    return this._open
  }

  set open(b: boolean) {
    this._open = b
    this.render()
  }

  private _open = false

  connectedCallback() {
    this.render()
    document.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        this.open = false
      }
    })
  }
  render() {
    if (!this.open) {
      render(<></>, this.root)
      return
    }
    let click = (e: PointerEvent) => {
      const P = e.composedPath().find(x => 'id' in x && x.id === 'v-popup')
      if (!P) {
        this.open = false
      }
      // console.log(e.composedPath())
    }
    render(
      <div ref={this.R} onClick={click} class='inset-0 fixed bg-[rgba(0,0,0,0.5)] z-50'>
        <div
          id='v-popup'
          class='relative shadow-lg rounded-lg p-4 bg-white dark:bg-gray-800 w-[min(500px,40vw)] min-w-[300px] mt-20 mx-auto justify-center'
        >
          <div class='absolute top-[-20px] right-[-20px]'>
            <v-icon class='cursor-pointer w-6 h-6 text-white' name='Close' onClick={() => this.open = false}></v-icon>
          </div>
          <div class='w-full h-full text-center mainthing'>
            <div class='flex h-full flex-col justify-between'>
              <slot></slot>
            </div>
          </div>
        </div>
      </div>,
      this.root,
    )
  }
}
