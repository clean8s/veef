import React from 'react'
import { render, alertCss } from './style'
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

  alertType() {
    const typ = Alert.observedAttributes.find(x => this.getAttribute(x) != null);
    return typ ? typ : 'info'
  }

  render() {
    let icon = 'info'
    const currentType = this.alertType()

    if (typeof currentType != 'undefined') {
      icon = `${currentType[0].toUpperCase()}${currentType.substring(1)}`
    }

    render(
      <>
      <style>{alertCss}</style>
      <div class={currentType} id='alert'>
        <v-icon name={icon} class='flex-shrink-0 w-6 h-6 fill-current mx-2' />
        <div>
          <slot></slot>
        </div>
      </div></>,
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
