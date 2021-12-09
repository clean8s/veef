import React from 'react'
import JSONTree from 'react-json-tree'
import { render } from './style'
import { fnCall, Slottable, TmSlot } from './slottable'
import { invertBase16Theme, invertTheme, Theme } from 'react-base16-styling';
import { monokai, VeefTheme } from '../icons/tree-theme'
import { StylingFunction, Base16Theme  } from 'react-base16-styling';


type Handler = {
  data: object,
  type: string,
  path: (string|number)[],
  isExpanded: boolean,
  value: any
}

export class Tree extends Slottable {
  //@ts-ignore
  root: ShadowRoot
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.handlers = {
      renderLabel(path: (string | number)[], type: string, isExpanded: boolean, canExpand: boolean) {
        return <span>{path[0]}</span>
      },
      valueRender(friendlyValue: any, value: any, path: (string | number)[]) {
        return <span>{friendlyValue}</span>
      },
      infoRender(type: string, fullValue: any, friendlyValue: string, path: (string | number)[]) {
        return <span>{friendlyValue}</span>
      },
      initOpen(path: (string|number)[], data: any) {
        return path.length < 2;
      }
    }
  }
  
  handlers;

  get initOpen() {
    return this.handlers.initOpen;
  }
  set initOpen(fn: any) {
    this.handlers.initOpen = fn;
  }

  connectedCallback() {
    this.render()
    this.slotSetup(this.root as any as HTMLElement, () => this.render())
  }

  renderInfo(h: Handler) {
    const itemN: string = h.type == 'Object' ? 
      `object[${Object.keys(h.value).length}]` : h.type == 'Array' ? `array[${h.value.length}]` : '';
    return itemN
  }

  renderLabel(h: Handler) 
  {
    return h.path[0]
  }

  render() {
    if (!this.root) return
    
    const App = () => {
      return <>
      <style>
        {`
        .vf-tree {
          margin: 0;
          padding: 10px;
        }
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
          shouldExpandNode={(path, data) => this.initOpen(path, data)}
          labelRenderer={(path, type, isExpanded, canExpand) => {
            const args = { path, type, isExpanded, canExpand }
            let name = path[0]
            return this.renderLabel({
              data: this.data,
              isExpanded: isExpanded,
              path: path,
              type: type,
              value: ""
            });

            // return this.handlers.renderLabel(path, type, isExpanded, canExpand)
          }}
          valueRenderer={(friendlyValue, value, ...path) => {
            const args = { friendlyValue, value, path }
            return this.handlers.valueRender(friendlyValue, value, path)
          }}
          getItemString={(type, fullValue, _, itemStr, path) => {
            // const friendlyValue = `${type} (${itemStr})` 
            const tree = fullValue
            const l = fullValue instanceof Array ? fullValue.length : Object.keys(fullValue).length;
            return <> {this.renderInfo({
              data: this.data,
              isExpanded: true,
              path: path,
              type: type,
              value: fullValue
            })} </>
            // return this.handlers.infoRender(type, fullValue, friendlyValue, path)
          }}

          theme={this._theme }
          data={this.data}
          invertTheme={!this._darkMode}
        />

        <slot name='setup'></slot>
      </>
    }

    render(<App />, this.root as any as HTMLElement)
  }

  private get arrowColor() : string{
    let theme = this._theme.extend as Base16Theme;
    if(!this._darkMode) {
      theme = invertBase16Theme(theme);
    }
    const hex = theme["base0D"];
    return `%23${hex.substring(1)}`;
  }

  private _internalData: any = ''

  private _theme = VeefTheme(monokai);
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

  set theme(v: Record<string, string>) {
    if (v == null || typeof v != 'object') return
    
    let b16: Partial<Base16Theme> = {
      base00: v.background || undefined,
      base0D: v.text || undefined,
      base0B: v.str || undefined,
      base09: v.num || undefined
    }
    b16 = Object.fromEntries(Object.entries(b16).filter(([k, v]) => typeof v === 'string'));
    this._theme = VeefTheme({...monokai, ...b16})
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
    return ['data', 'dark', 'initopen']
  }
}
