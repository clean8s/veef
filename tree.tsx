import React from 'react'
import JSONTree from 'react-json-tree'
import { render } from './style'
import { fnCall, TmSlot } from './slottable'
import { Theme } from 'react-base16-styling';
import { monokai, VeefTheme } from './icons/tree-style'


export class Tree extends TmSlot {
  //@ts-ignore
  root: ShadowRoot
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
  }
  handlers = {
    renderLabel(path: (string | number)[], type: string, isExpanded: boolean, canExpand: boolean) {
      return <span>{path[0]}</span>
    },
    valueRender(friendlyValue: any, value: any, path: (string | number)[]) {
      return <span>{friendlyValue}</span>
    },
    infoRender(type: string, fullValue: any, friendlyValue: string, path: (string | number)[]) {
      return <span>{friendlyValue}</span>
    },
  }

  connectedCallback() {
    this.render()
    this.slotSetup(this.root as any as HTMLElement, () => this.render())
  }

  render() {
    if (!this.root) return
    
    const App = () => {
      return <>
      <style>
        {`
        .arrow{
          font-size: 1px;
          letter-spacing: -1px;
        }
        .arrow::after {
          content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${this.arrowColor}' width='22' height='22'%3E%3Cpath d='M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'%3E%3C/path%3E%3C/svg%3E");
        }
        .arrow.arrow-open::after {
          content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${this.arrowColor}' width='22' height='22'%3E%3Cpath d='M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z'%3E%3C/path%3E%3C/svg%3E")
        }
        li2>div:first-child:after {
          content: "A";
        }`}
      </style>

        <JSONTree
          labelRenderer={(path, type, isExpanded, canExpand) => {
            const args = { path, type, isExpanded, canExpand }
            return this.handlers.renderLabel(path, type, isExpanded, canExpand)
          }}
          valueRenderer={(friendlyValue, value, ...path) => {
            const args = { friendlyValue, value, path }
            return this.handlers.valueRender(friendlyValue, value, path)
          }}
          getItemString={(type, fullValue, itemType, itemStr, path) => {
            const friendlyValue = `${type} (${itemStr})`

            return this.handlers.infoRender(type, fullValue, friendlyValue, path)
          }}

          theme={this._theme as any}
          data={this.data}
          invertTheme={!this._darkMode}
        />

        <slot name='setup'></slot>
      </>
    }

    render(<App />, this.root as any as HTMLElement)
  }

  private get arrowColor() : string{
    return `%23${monokai.base0D.substring(1)}`;
  }

  private _internalData: any = ''

  private _theme = VeefTheme;
  private _darkMode: boolean = false

  get data() {
    return this._internalData
  }
  
  set data(v: any) {
    this._internalData = v
    this.render()
  }

  get theme(): Theme {
    return this._theme
  }

  set theme(v: Theme) {
    if (v == null || typeof v != 'object') return
    this._theme = v
    this.render()
  }

  get dark() {
    return this._darkMode
  }

  set dark(v: any) {
    if (v === true || (v !== '0' && v !== 'false' && v !== false)) {
      this._darkMode = true
    } else {
      this._darkMode = false
    }
    this.render()
  }
  
  static get observedAttributes() {
    return ['data', 'dark', 'labelrender', 'inforender']
  }
}
