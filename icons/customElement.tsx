
import React from 'react'
import IconLibrary, { IconComponent, IconKey } from './lib/icons'
import {render} from '../src/style'

customElements.define(
  'v-icon',
  class extends HTMLElement {
    root
    constructor() {
      super()
      this.root = this.attachShadow({ mode: 'open' })
      this.render()
    }
    // connectedCallback() {
    //   this.render()
    // }
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
          <div style='display: flex; flex-wrap: wrap; justify-content: center;'>
            {Object.keys(IconLibrary).map(x => {
              let maybeLine = null;
              
              if(x === 'Youtube' || x === 'Close' || x == 'Github') maybeLine = <div class="separator" style={`	flex-basis: 100%;
              height: 10px;
              border-bottom: 1px solid rgb(188, 188, 188);`} />
              return <>{maybeLine}<div style='margin: 5px;text-align: center; width: 120px; flex-basis: 120px;'>
                <v-icon name={x} style='width: 40px; height: 40px;' />
                <div style="font-weight: 500; color: #333;">{x}</div>
              </div></>
            })}
          </div>,
          this.root,
        )
        return
      }
      render(
        <>
          <SingleIcon />
        </>,
        this.root,
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