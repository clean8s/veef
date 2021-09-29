import {defaultConverter, LitElement, unsafeCSS} from "lit"
import { ReactiveElement } from "@lit/reactive-element";
import {Component, ComponentChild, render, RenderableProps, createRef, RefObject, cloneElement, hydrate, createElement, h as preactH, FunctionComponent} from "preact";
import {unsafeHTML} from "lit/directives/unsafe-html.js"
import  'virtual:windi.css'

export type PropType<O extends {[k: string]: abstract new (...args: any) => any}> =
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

export type RxProps = {customElement: CustomElement}

export abstract class RxComponent<O> extends Component<O & RxProps, any> {
    render(props: RenderableProps<O & RxProps> , state: any, context: any): ComponentChild {
        return this.reactRender(props) as ComponentChild;
    }

    componentDidMount() {
        this.customElement.restyle(this.mainStyle, this.mainClasses, true)
    }

    componentDidUpdate() {
        this.customElement.restyle(this.mainStyle, this.mainClasses, false)
    }

    get mainStyle() : string {
        return ""
    }

    get mainClasses() : string[] {
        return []
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

abstract class CustomElement extends ReactiveElement {
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
    private objectId : string;

    constructor() {
        super();
        this.appendQueue = [];
        this.objectId = Math.random().toString(36).substring(3);
    }

    public getObjectId() {
        return this.objectId;
    }

    connectedCallback() {
        super.connectedCallback()
        this.reactRoot = this;
        // this.appendChild(this.reactRoot)
        // this.restyle("", []);
        // [...this.children].map(x => {
        //     if(this.tagName === 'V-TABLE' && x.tagName === 'V-TABLE') {
        //         // x.remove()
        //         // this.querySelector(".row-slot")?.appendChild(x.cloneNode(true))
        //         this.oldChildren.push(x.cloneNode(true) as HTMLElement)
        //         x.remove()
        //     }
        // })
    }

    public reactRoot : HTMLElement = null as any;


    restyle(mainStyle: string, mainClasses: string[], isInitial: boolean) {
        if(mainStyle === "") {
            this.reactRoot.removeAttribute("style")
        } else {
            this.reactRoot.setAttribute("style", mainStyle)
        }
        this.reactRoot.classList.forEach((x) => {
            if(mainClasses.indexOf(x) === -1) {
                this.reactRoot.classList.remove(x)
            }
        })
        this.reactRoot.classList.add(...mainClasses)
    }

    preactRender() {
        this.reactActive = true;
        if(false) {
            hydrate(<this.PreactComponent customElement={this} {...this.getProps()} />, this.reactRoot)
            // cloneElement(Constructor as any, {shadowRoot: this.renderRoot, ...this.getProps()})
        }
        else {
            render(<this.PreactComponent customElement={this} {...this.getProps()} />, this.reactRoot)
            this.hasRendered = true;
        }
        this.reactActive = false;
        this.appendQueue?.map(x => {
            this.querySelector(`object[name="${x.slot}"]`)?.append(x.element)
        })
    }

    createRenderRoot() {
        return this;
        const N = this.attachShadow({mode: "open"})
        N.appendChild(document.createElement("slot"))
        return N;
    }

    private hasRendered = false;
    public appendQueue: {element: Node, slot: string}[];


    updated() {
        this.preactRender()
    }

    public reactActive: boolean = false;
    override append<T extends Node>(...nodes: T[]) : T[] {
        return nodes.map(x => {
        if(x.nodeType == 1) {
            const el : HTMLElement = x as any as HTMLElement;
            if(el.hasAttribute("slot")) {
                this.appendQueue?.push({element: x, slot: el.getAttribute("slot") || ""})
                return x;
            }
        }
        super.append(x);
        return x;
        }) as T[];
    }

    override appendChild<T extends Node>(node: T) : T {
        return this.append(node)[0];
    }
    // get updateComplete() : Promise<boolean> {
    //     return new Promise((e) => {
    //         this.preactRender()
    //         e(true)
    //     })
    // }
    // performUpdate() {
    //     super.performUpdate()
    //     // return unsafeHTML(strRender(<Constructor shadowRoot={this.renderRoot} {...this.getProps()} />))
    // }

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