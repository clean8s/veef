import React from 'react'
import JSONTree from 'react-json-tree'
import { render } from './style'
import { fnCall, TmSlot } from './slottable'
import createStyling from 'react-json-tree/lib/createStylingFromTheme'
import { StylingFunction } from 'react-base16-styling';

type ThemeObj = Record<string, string> | {[key in "base00"]: string};
const blah = ({ style }: {style: any}, nodeType: string, expanded: boolean) => ({
  style: {
    // display: 'none'
  },
  className: `arrow arrow-${expanded ? "open" : "closed"}`
});
const blah2 = ({ style }: {style: any}, nodeType: string, expanded: boolean) => ({
  style: {
    ...style,
    'padding-right': 0,
    'vertical-align': 'middle'
  },
  className: `arr-wrap`
});

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

  set labelrender(fn: string) {
    this.labelRender = (...args) => fnCall(fn, ...args)
  }

  get labelRender() {
    return this.handlers.renderLabel
  }
  set labelRender(fn) {
    this.handlers.renderLabel = fn
    this.render()
  }
  get valueRender() {
    return this.handlers.valueRender
  }
  set valueRender(fn) {
    this.handlers.valueRender = fn
    this.render()
  }
  get infoRender() {
    return this.handlers.infoRender
  }
  set infoRender(fn) {
    this.handlers.infoRender = fn
    this.render()
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
        .arr-wrap {
          padding-right: 0;
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
      <div class='p-2' style={`background:${this.theme.base00}`}>
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
        </div>

        <slot name='setup'></slot>
      </>
    }

    render(<App />, this.root as any as HTMLElement)
  }

  private get arrowColor() : string{
    return `%23${this._theme2.base0D.substring(1)}`;
  }

  private _internalData: any = ''
  private _theme2: ThemeObj = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633',
  }
  private _theme = {
    'extend': this._theme2,
    arrowSign: blah,
    arrowContainer: blah2,
  }
  private _darkMode: boolean = false

  get data() {
    return this._internalData
  }
  
  set data(v: any) {
    this._internalData = v
    this.render()
  }

  get theme(): ThemeObj {
    return this._theme
  }

  set theme(v: ThemeObj) {
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

  set inforender(fn: string) {
    this.infoRender = (...args) => fnCall(fn, ...args)
  }

  static get observedAttributes() {
    return ['data', 'dark', 'labelrender', 'inforender']
  }
}
