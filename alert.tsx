import React from 'react'
import { render } from './style'
import { TmSlot } from './slottable'

export class Alert extends TmSlot {
  root: HTMLElement
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
  }

  connectedCallback() {
    this.render()
  }

  render() {
    let icon = 'info'
    const attr = Alert.observedAttributes.find(x => this.getAttribute(x) != null)

    if (typeof attr != 'undefined') {
      icon = attr[0].toUpperCase() + attr.substring(1)
    }

    render(
      <div class='flex'>
        <v-icon name={icon} class='w-6 h-6 fill-current mx-2' />
        <div>
          <slot></slot>
        </div>
      </div>,
      this.root,
    )
  }

  attributeChangedCallback(key: string, _: any, newVal: string) {
    this.render()
  }

  static get observedAttributes() {
    return ['info', 'warning', 'success', 'error']
  }
}
