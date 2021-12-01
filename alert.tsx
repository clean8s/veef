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

export class Tabs extends TmSlot {
  root: HTMLElement
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
  }

  connectedCallback() {
    this.render()
  }

  render() {
    render(
      <>
      <div class="flex p-1 px-2 mb-5 space-x-1 bg-[#eaeaea] rounded-t-xl" role="tablist" aria-orientation="horizontal">
        <button style="transform: translateY(3px)" class="w-full py-2.5 text-sm leading-5 font-medium text-black
        rounded-t-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400
        ring-white ring-opacity-60 bg-white hover:ring-2 hover:ring-offset-gray-300" id="headlessui-tabs-tab-1" role="tab" type="button" aria-selected="true" aria-controls="headlessui-tabs-panel-4">
          Recent
          </button>
          <button style="transform: translateY(0px)" class="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg
          focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white
          shadow-lg
          ring-opacity-60 text-[#555] bg-[#eee] hover:bg-[#fff]" id="headlessui-tabs-tab-2" role="tab" type="button" aria-selected="false" tabindex="-1">
            Popular</button>
            </div>
      </>,
      this.root,
    )
  }

  attributeChangedCallback(key: string, _: any, newVal: string) {
    this.render()
  }

  static get observedAttributes() {
    return []
  }
}

