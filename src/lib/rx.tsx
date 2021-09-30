import {defaultConverter, LitElement, unsafeCSS} from "lit"
import { PropertyDeclaration, ReactiveElement } from "@lit/reactive-element";
import {Component, ComponentChild, render, RenderableProps, createRef, RefObject, cloneElement, hydrate, createElement, h as preactH, FunctionComponent} from "preact";
import {unsafeHTML} from "lit/directives/unsafe-html.js"
import  'virtual:windi.css'
import "./comp.css"

// any type describing a class constructor for a (sub)type, i.e. NumberConstructor for <T extends number>
type PropTypeConstructor = abstract new (...args: any) => any
type Unbox<T> = T extends String ? string : T extends Number ? number : T extends Boolean ? boolean : T
// Convert a hint to an instance type (i.e. {type: Number} to number)
type GetType<T extends {type: PropTypeConstructor}> = Unbox<InstanceType<T["type"]>>
// Convert hints to Preact prop types
export type PropType<O extends {[k: string]: {type: PropTypeConstructor}}> =
    { [k in keyof O]: GetType<O[k]> }
type PropObj = {[k in string]: {type: PropTypeConstructor, default: any}}

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
        const C =  this.reactRender(props) as ComponentChild;
        return C
    }

    componentDidMount() {
        this.customElement.restyle(this.mainClasses, true)
    }

    componentDidUpdate() {
        this.customElement.restyle(this.mainClasses, false)
    }

    // get mainStyle() : string {
    //     return ""
    // }

    get mainClasses() : string[] | undefined {
        return undefined;
    }

    get customElement() : CustomElement {
        return this.props.customElement;
    }

    abstract reactRender(props: O) : any;
}

import { BASE_CSS } from './base-css'

export function Rx(tagName: string, propTypes?: PropObj, disableShadowRoot?: boolean) : Function {
    return (Constructor: PreactComponent) => {
        if(customElements.get(tagName)) {
            CustomElement.refresh(tagName, Constructor, propTypes)
        }
        customElements.define(tagName, CustomElement.create(tagName, Constructor, propTypes));
    }
}

type PreactComponent = FunctionComponent<RxProps>

import { VNode } from "preact";
// import renderStr from 'preact-render-to-string';

import { toChildArray } from "preact";
const ComponentMarker = ({children} : {children: VNode<any>}) => {
    return children;
}

abstract class CustomElement extends ReactiveElement {
    static create(name: string, c: PreactComponent, propTypes?: PropObj) {
        const newClass = class extends CustomElement {
            constructor() {
                super();
            }

            get PreactComponent() {
                const refC = CustomElement.refreshMap.get(name);
                if(refC) {
                    return refC;
                } 

                return c;
            }

            propTypes() : PropObj | {} {
                return propTypes || {};
            }

            getPropsFromAttributes() : {[k in string]: InstanceType<any>} {
                const propValEntries = Object.entries(this.propTypes()).map(([propName, propHint]: [string, {default: any, type: any}]) => {
                    const defaultVal = propHint.default;
                    const val = Reflect.get(this, propName)
                    if(typeof val !== undefined && val !== null) {
                        return [propName, val];
                    }
                    return [propName, defaultVal];
                });
                return Object.fromEntries(propValEntries);
            }

            static get properties() : {[k in string]: PropertyDeclaration} {
                const Props = Object.fromEntries(Object.entries(propTypes || {}).map(([k, v]) => [k, {
                    type: v.type,
                    converter: propConverter,
                    reflect: true
                }
                ]))
                return Props
            }
        };
        CustomElement.tagHandler.set(name, newClass);
        return newClass;
    }


    static refreshMap = new Map();
    static tagHandler = new Map();

    static refresh(tagName: string, c: PreactComponent, propType?: Object) {
        this.refreshMap.set(tagName, c);
        [...document.querySelectorAll(tagName)].map(x => {
            if("preactRender" in x) {
                (x as any).preactRender();
            }
        })
    }

    abstract get PreactComponent() : PreactComponent;
    abstract propTypes() : Object;
    private objectId : string;
    abstract getPropsFromAttributes() : any;

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
        this.setAttribute("data-vid", this.getObjectId())
    }

    public reactRoot : HTMLElement = null as any;


    restyle( mainClasses: string[] | undefined, isInitial: boolean) {
        if(typeof mainClasses !== 'undefined') {
            [...this.reactRoot.classList].map((x) => {
                if(mainClasses.indexOf(x) === -1) {
                    this.reactRoot.classList.remove(x)
                }
            })
            this.reactRoot.classList.add(...mainClasses)
        }
    }

    preactRender() {
        if(this.hasRendered) {
            hydrate(<ComponentMarker><this.PreactComponent customElement={this} {...this.getPropsFromAttributes()}/></ComponentMarker>, this.reactRoot)
        } else {
            this.reactActive = true;
            render(<ComponentMarker><this.PreactComponent customElement={this} {...this.getPropsFromAttributes()}/></ComponentMarker>, this.reactRoot)
            this.reactActive = false;
            // this.hasRendered = true;
        }
        [...this.querySelectorAll("*[slot]")].map(x => {
            if(x !== null && typeof x !== 'undefined') {
                if(x.parentElement?.tagName !== "OBJECT")
                this.querySelector(`object[name="${x.slot}"]`)?.append(x)
            }
        })
        return;
    }

    createRenderRoot() {
        return this;
    }

    private hasRendered = false;
    public appendQueue: {element: Node, slot: string}[];


    updated() {
        this.preactRender()
    }

    public reactActive: boolean = false;
    override append<T extends Node>(...nodes: T[]) {
        // const out = nodes.map(x => {
        // if(x.nodeType == 1) {
        //     const el : HTMLElement = x as any as HTMLElement;
        //     if(el.hasAttribute("slot")) {
        //         this.appendQueue?.push({element: x, slot: el.getAttribute("slot") || ""})
        //         // return x;
        //     }
        // }
        // super.append(x);
        // return x;
        // }) as T[];
        this.requestUpdate()
        return super.append(...nodes);
    }

    override appendChild<T extends Node>(node: T) : T {
        this.requestUpdate()
        return super.appendChild(node)
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