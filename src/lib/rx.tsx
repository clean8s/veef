import {defaultConverter, LitElement, unsafeCSS} from "lit"
import {Component, ComponentChild, render, RenderableProps, createRef, RefObject, cloneElement, hydrate, createElement, h as preactH, FunctionComponent} from "preact";
import {unsafeHTML} from "lit/directives/unsafe-html.js"
import  'virtual:windi.css'

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

export type RxProps = {restyleCallback?: ((style: string, x: string[]) => void), customElement: CustomElement}

export abstract class RxComponent<O> extends Component<O & RxProps, any> {
    render(props: RenderableProps<O & RxProps> , state: any, context: any): ComponentChild {
        return this.reactRender(props) as ComponentChild;
    }

    componentDidMount() {
        if (this.props.restyleCallback)
            this.props.restyleCallback(this.mainStyle, this.mainClasses)
    }

    componentDidUpdate() {
        if (this.props.restyleCallback)
            this.props.restyleCallback(this.mainStyle, this.mainClasses)
    }

    get mainStyle() : string {
        return ""
    }

    get mainClasses() : string[] {
        return []
    }

    static get rootStyle() : string {
        return "";
    }

    get customElement() : CustomElement {
        return this.props.customElement;
    }

    getChildren():  HTMLElement[] {
        return this.customElement.oldChildren;
    }

    abstract reactRender(props: O) : any;
}
interface StyleProvider {
     get rootStyle() : string;
}

import { BASE_CSS } from './base-css'

export function Rx(tagName: string, propTypes?: Object, disableShadowRoot?: boolean) : Function {
    return (Constructor: PreactComponent) => {
        customElements.define(tagName, CustomElement.create(Constructor, propTypes));
    }
}

type PreactComponent = FunctionComponent<RxProps>

abstract class CustomElement extends LitElement {
    static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: false}
    private Constructor: PreactComponent;

    static create(c: PreactComponent, propType?: Object) {
        return class extends CustomElement {
            get PreactComponent() {
                return c;
            }

            propTypes() : Object {
                return propType || {};
            }

            static get properties() {
                const Props = Object.fromEntries(Object.entries(propType || {}).map(([k, v]) => [k, {
                    type: v,
                    converter: propConverter
                }
                ]))
                return Props
            }
        }
    }

    abstract get PreactComponent() : PreactComponent;
    abstract propTypes() : Object;

    constructor(c: PreactComponent) {
        super();
        this.Constructor = c;
    }

    connectedCallback() {
        super.connectedCallback()
        this.reactRoot = this;
        // this.appendChild(this.reactRoot)
        this.setupStyles();
        // [...this.children].map(x => {
        //     if(this.tagName === 'V-TABLE' && x.tagName === 'V-TABLE') {
        //         // x.remove()
        //         // this.querySelector(".row-slot")?.appendChild(x.cloneNode(true))
        //         this.oldChildren.push(x.cloneNode(true) as HTMLElement)
        //         x.remove()
        //     }
        // })

        const m = new MutationObserver((d) => {
            console.log(d)
        })
        m.observe(this, {childList: true})
    }

    public reactRoot : HTMLElement = null as any;

    private mainStyle = "";
    private mainClasses: string[] = [];

    setupStyles() {
        // [...this.children].map(x => {
        //     if(x.tagName !== "OUTPUT")
        //     this.appendChild(x)
        // } )
        // this.setAttribute("style", "display: grid;")
        this.reactRoot.setAttribute("style", this.mainStyle)
        this.reactRoot.classList.add(...this.mainClasses)
    }

    restyle(mainStyle: string, mainClasses: string[]) {
        this.mainStyle = mainStyle;
        this.mainClasses = mainClasses;
        this.setupStyles()
    }

    protected createRenderRoot() {
        return this;
    }

    static get styles() {
        return [];
    }

    private hasRendered = false;
    public oldChildren: HTMLElement[] = [];

    render() {
        if(this.hasRendered) {
            hydrate(<this.PreactComponent customElement={this} restyleCallback={(a: any, b: any) => this.restyle(a, b)} {...this.getProps()} />, this.reactRoot)
            // cloneElement(Constructor as any, {shadowRoot: this.renderRoot, ...this.getProps()})
        }
        else {

            render(<this.PreactComponent customElement={this} restyleCallback={(a: any, b: any) => this.restyle(a, b)} {...this.getProps()} />, this.reactRoot)
            this.hasRendered = true;
        }


        return null;
        // return unsafeHTML(strRender(<Constructor shadowRoot={this.renderRoot} {...this.getProps()} />))
    }

    getProps() {
        // @ts-ignore
        return Object.fromEntries(Object.keys(this.propTypes()).map(x => [x, this[x]]))
    }
}

import htmH from "htm"
export const htmBound =  htmH.bind(preactH)

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