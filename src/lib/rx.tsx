import {defaultConverter, LitElement, unsafeCSS} from "lit"
import {Component, ComponentChild, render, RenderableProps, createRef, RefObject, cloneElement, hydrate} from "preact";
import {unsafeHTML} from "lit/directives/unsafe-html.js"
import virtualCss from 'virtual:windi.css'

export type BasicConstructor = NumberConstructor|StringConstructor|ObjectConstructor|ArrayConstructor|BooleanConstructor;

export type PropType<O extends {[k: string]: BasicConstructor}> =
    { [k in keyof O]?: InstanceType<O[k]> }

let propConverter = {
    fromAttribute: (val: any, type: any) => {
        // if (val.startsWith(DOMATTR_MARK)) {
        //     return (window as CustomWindow).domAttrMap.get(val)
        // }
        return (defaultConverter as any).fromAttribute(val, type)
    },
    toAttribute: (val: any, type: any) => {
        return (defaultConverter as any).toAttribute(val, type)
    }
}

export type Shadow = {shadowRoot?: HTMLElement}

export abstract class RxComponent<O> extends Component<O & Shadow, any> {
    render(props: RenderableProps<O & Shadow> , state: any, context: any): ComponentChild {
        return <>{this.reactRender(props)}<style dangerouslySetInnerHTML={{__html: this.style }} /></> as ComponentChild;
    }

    get style() : string {
        return ""
    }

    static get rootStyle() : string {
        return "";
    }

    rootNode() : HTMLElement {
        if(this.isShadowDOM()) {
            return this.props.shadowRoot as HTMLElement;
        } else {
            return this.base as HTMLElement;
        }
    }
    isShadowDOM() : boolean {
        if(typeof this.props.shadowRoot !== 'undefined' && this.props.shadowRoot) {
            return true;
        }
        return false;
    }

    abstract reactRender(props: O) : any;
}
interface StyleProvider {
     get rootStyle() : string;
}

import { BASE_CSS } from './base-css'

export function Rx(tagName: string, propTypes?: Object) : Function {
    return (Constructor: Function) => {
        if (customElements.get(tagName)) {
            return;
        }
        customElements.define(tagName, class extends LitElement {
            static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true}

            constructor() {
                super();
            }

            static get styles() {
                const rootS = (Constructor as unknown as StyleProvider).rootStyle;
                return [unsafeCSS(virtualCss), unsafeCSS(":host{display: inline-block}"), unsafeCSS(BASE_CSS)]
            }

            private hasRendered = false;

            render() {
                if(this.hasRendered) {
                    hydrate(<Constructor shadowRoot={this.renderRoot} {...this.getProps()} />, this.renderRoot)
                    // cloneElement(Constructor as any, {shadowRoot: this.renderRoot, ...this.getProps()})
                }
                else {
                    render(<Constructor shadowRoot={this.renderRoot} {...this.getProps()} />, this.renderRoot)
                    this.hasRendered = true;
                }
                return null;
                // return unsafeHTML(strRender(<Constructor shadowRoot={this.renderRoot} {...this.getProps()} />))
            }

            getProps() {
                // @ts-ignore
                return Object.fromEntries(Object.keys(propTypes || {}).map(x => [x, this[x]]))
            }

            static get properties() {
                const Props = Object.fromEntries(Object.entries(propTypes || {}).map(([k, v]) => [k, {
                    type: v,
                    converter: propConverter
                }
                ]))
                return Props
            }
        })
        return Constructor
    }
}

//
// type CustomWindow = Window & typeof globalThis &{ domAttrMap: any, domAttr: any }
// let customWin = (window as CustomWindow)

// const DOMATTR_MARK = "domAttr-val-"
//
// export const domAttr = (data: any) => {
//     if (typeof customWin.domAttrMap == 'undefined') {
//         customWin.domAttrMap = new Map();
//     }
//     const genID = DOMATTR_MARK + (Math.random() + 1).toString(36).substring(2)
//     customWin.domAttrMap.set(genID, data);
//     return genID;
// }
//
// if (typeof window != 'undefined') {
//     customWin.domAttr = domAttr;
// }