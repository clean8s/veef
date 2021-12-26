import React from 'react'
import { render, renderWithCss } from './style'
import { Slottable, TmSlot } from './slottable'
import tabStyle from '../icons/tabs.css';
import {strToNode, Transformable} from "./transformable";

export class Tabs extends Transformable {
    constructor() {
        super(true);
    }
    connectedCallback() {
        super.connectedCallback()
        // window.addEventListener("hashchange", (e) => {
        //     const id = new URL(e.newURL).hash.substring(1)
        //     if(this.selectedId == id) return
        //     const el = document.getElementById(id)
        //     if(el && this.contains(el)) {
        //         this.pickTab(el)
        //     }
        // });
        // window.addEventListener("popstate", (e) => {
        //     console.log(JSON.stringify(e.state))
        // })

        this.firstCheck()
        document.addEventListener("DOMContentLoaded", () => this.firstCheck())
    }
    firstCheck() {
        if(this.selectedId !== "") return
        let currentURL = new URL(window.location);
        const _id = currentURL.hash.substring(1)
        const maybeEl = document.getElementById(_id)
        if(maybeEl && this.contains(maybeEl)) {
            this.pickTab(maybeEl as HTMLAnchorElement)
        } else {
            if(Array.isArray(history.state)) {
                const candidate = history.state.map(x => this.querySelector("#" + x)).find(x => x != null);
                if(candidate) {
                    console.log(candidate)
                    this.pickTab(candidate)
                    return
                }
            }
            const el = this.querySelector("*[id]")
            if(el) {
                this.pickTab(el)
            }
        }
    }

    pickTab(el: HTMLAnchorElement | HTMLDivElement) {
        [...this.querySelectorAll("a,*[slot='content']")].map(x => {
            x.classList.remove("active")
            x.setAttribute("draggable", "false")
        });

        el.classList.add("active");
        let id = ""
        if(el.tagName.toLowerCase() !== 'a') {
            id = el.id;
            const link = ([...el.parentElement!.children]).find(x => x instanceof HTMLAnchorElement && new URL(x.href).hash === "#" + el.id);
            if(link) {
                link.classList.add("active")
            }
        } else {
            id = new URL(el.href).hash.substring(1)
            document.getElementById(id)!.classList.add("active")
        }

        this.selectedId = id;
        this.doRender()
    }
    pickDefault() {
        if(this.querySelectorAll("a[href]").length > 0 && this.selectedId === "") {
            const el = (this.querySelector("a[href]") as HTMLAnchorElement)
            this.pickTab(el)
        }
    }
    selectedId = ""
    render(customSlot?: React.ReactNode) {
        return <><div part="tabwrap" id="#tabwrap" onClick={(e) => {
            if(!(e.target instanceof Element)) return;
            const el = e.target.closest("a")!;
            let oldId = this.selectedId
            const id = new URL(el.href).hash.substring(1);
            if(id == this.selectedId) return;
            this.pickTab(el)
            let s: string[] = window.history.state
            if(typeof s == 'undefined' || !Array.isArray(s)) s = []
            window.history.replaceState([...(s.filter(x => x != oldId)), this.selectedId], "", window.location)
            // window.history.pushState({id: this.selectedId}, "", el.href)
            e.preventDefault()
            return
        }}
                      className="flex p-2 px-[1px] pb-0 space-x-1 border-b-1 border-[#ccc] rounded-t-xl" role="tablist"
                      aria-orientation="horizontal">
            {customSlot}
        </div>
            <style dangerouslySetInnerHTML={{__html: tabStyle}}></style>
            <div part="around" id="__content" className="mx-[1px] p-2 border-1 rounded-b">
               <slot name="content" />
            </div></>
    }
    afterRender(childrenChanged: boolean) {
        super.afterRender(childrenChanged);
        // const theContent = this.root.querySelector("#__content")!;
        // [this.querySelectorAll("a>template")].map(x => {
        //
        // })
        // const M = this.querySelector("a.active>template") as HTMLTemplateElement | null;
        // if(M == null) return;
        // theContent.innerHTML = "";
        // theContent.append(M.content.cloneNode(true));
    }
}

export class Tabs2 extends Slottable {
    root: HTMLElement
    constructor() {
        super()
        this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement;
        this.render()
        this.slotSetup(this.root, () => this.onSlot())
        this.addEventListener('click', (e) => {
            const tgt = e.target as HTMLElement;
            const btn = tgt.slot == 'tab' ? tgt : tgt.closest('*[slot="tab"]') as HTMLElement;
            if(btn) {
                if(typeof btn != 'undefined') {
                    this.tabTargetToggle(btn as HTMLElement)
                }
            }
        })
    }

    connectedCallback() {

    }

    onSlot() {
        this.slottedAny("").filter(x => !x.hasAttribute("data-veef-active")).map(x => x.style.display = 'none')
        if(!this.hadFirst) {
            const content = this.slottedAny("");
            const tabs = this.slottedAny("tab");
            if(content.length > 0 && tabs.length > 0) {
                this.tabTargetToggle(tabs[0])
            }
            // this.render()
        }

    }

    render() {
        renderWithCss(tabStyle)(
            <>
                <div part="tabwrap" id="#tabwrap" class="flex p-2 px-[1px] pb-0 space-x-1 border-b-1 border-[#ccc] rounded-t-xl" role="tablist" aria-orientation="horizontal">
                    <slot name="tab"></slot>
                </div>
                <div part="around" class="mx-[1px] p-2 border-1 rounded-b">
                    <slot name=""></slot>
                </div>
            </>,
            this.root,
        )
    }
    lastListeners: Map<HTMLElement, Function> = new Map();

    hadFirst = false;

    activeContentIdx = -1;

    tabTargetToggle (tab: HTMLElement) {
        const thisIdx = this.slottedAny("tab").findIndex(x => x === tab);
        if(thisIdx === -1 )
            return;
        const els = this.slottedAny("");
        // if(els.length < th)
        if(thisIdx >= els.length) return;
        const tgt = els[thisIdx]
        this.activeContentIdx = thisIdx;
        if(typeof tgt == 'undefined') return;
        this.slottedAny("tab").map(x => x.classList.remove('active'))
        this.slottedAny("").map(x => {
            x.style.display = 'none';
            x.removeAttribute("data-veef-active");
        })

        tab.classList.toggle("active", true)
        this.hadFirst = true;
        tgt.setAttribute("data-veef-active", "true");
        tgt.style.display = 'block'

        window.history.pushState({idx: thisIdx}, '', window.location);
    }

    attributeChangedCallback(key: string, _: any, newVal: string) {
        this.render()
    }

    static get observedAttributes() {
        return ['via']
    }
}
  
  