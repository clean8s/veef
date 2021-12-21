import { render } from 'preact'
import React from 'react'
import IconLibrary, { IconComponent, IconKey } from './lib/icons'

customElements.define(
  'v-icon',
  class extends HTMLElement {
    connectedCallback() {
      this.render()
    }
    render() {
      let SingleIcon: IconComponent
      let n = this.internalName

      if (n in IconLibrary) {
        const name: keyof typeof IconLibrary = n as any
        SingleIcon = IconLibrary[name]
      } else {
        SingleIcon = IconLibrary.Bolt
      }

      if (this.showAll) {
        render(
          <div style='display: flex; flex-wrap: wrap;'>
            {Object.keys(IconLibrary).map(x => {
              let maybeLine = null;
              
              if(x === 'Youtube' || x === 'Close' || x == 'Github') maybeLine = <div class="separator" />
              return <>{maybeLine}<div style='margin: 5px;text-align: center; width: 120px; flex-basis: 120px;'>
                <v-icon name={x} style='width: 40px; height: 40px' />
                <div class="allIconsLabel">{x}</div>
              </div></>
            })}
          </div>,
          this,
        )
        return
      }
      render(
        <>
          <SingleIcon />
        </>,
        this,
      )
    }
    attributeChangedCallback(key: string, _: any, newVal: any) {
      if (key == 'name') {
        this.internalName = newVal
      }
      if (key === 'all') {
        if (newVal !== false && newVal.trim() !== '0' && newVal.trim() !== 'false') {
          this.showAll = true
        }
      }
      this.render()
    }
    showAll = false
    internalName: IconKey = 'Bolt'
    get name(): string {
      return this.internalName
    }
    set name(k: string) {
      this.internalName = k as IconKey
      this.render()
    }
    static get observedAttributes() {
      return ['name', 'all']
    }
  },
)
