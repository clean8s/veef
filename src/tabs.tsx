import React from 'react'
import { render, renderWithCss } from './style'
import { Slottable, TmSlot } from './slottable'
import tabStyle from './css/tabs.css';
import {strToNode, Transformable} from "./transformable";

export class Tabs extends Transformable {
    constructor() {
        super(true);
    }
    connectedCallback() {
        super.connectedCallback()
        this.firstCheck()
        document.addEventListener("DOMContentLoaded", () => this.firstCheck())
    }
    firstCheck() {
        if(this.selectedId !== "") return

            if(history.state != null && Array.isArray(history.state["__veef_tabs"])) {
                const candidate = history.state["__veef_tabs"].map(x => this.querySelector("#" + x)).find(x => x != null);
                if(candidate) {
                    this.pickTab(candidate)
                    return
                }
            }
            const el = this.querySelector("*[id]")
            if(el) {
                this.pickTab(el)
            }
        // }
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
                // link.dispatchEvent(new Event("click"))
            }
        } else {
            id = new URL(el.href).hash.substring(1)
            const link = document.getElementById(id)!;
            link.classList.add("active")
            // link.dispatchEvent(new MouseEvent("click"))
        }

        this.selectedId = id;
        this.doRender()
        this.dispatchEvent(new CustomEvent("tabselect", {detail: id}))
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
            const el = e.target.closest("a");
            if(!el) return
            e.preventDefault()

            let oldId = this.selectedId
            const id = new URL(el.href).hash.substring(1);
            if(id == this.selectedId) return;
            this.pickTab(el)
            let s: any = window.history.state
            if(typeof s == 'undefined' || s == null) s = {}
            if(typeof s["__veef_tabs"] == 'undefined') s = {...s, __veef_tabs: []};
            const tabs: string[] = s.__veef_tabs.filter(x => x != oldId);
            const curTabs: string[] = [...tabs, this.selectedId];

            window.history.replaceState({...s, __veef_tabs: curTabs}, "", window.location)
            // window.history.pushState({id: this.selectedId}, "", el.href)
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
}
  