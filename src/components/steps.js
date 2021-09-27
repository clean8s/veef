import {css, html, LitElement} from "lit";
import {createRef, ref} from "lit/directives/ref.js";


import folderIcon from "icons:folder,16";
import fileIcon from "icons:description,16"
import expandIcon from "icons:expand_more,16"

class Tree extends LitElement {
    static root = css`:root{display: inline-block;}`
    static get properties() {
        return {
            xx: {type: Array},
            dir: {type: Boolean, attributeName: "dir"},
            root: {type: Boolean, attributeName: "root"}
        }
    }
    constructor() {
        super();
        this.root = false;
        this.dir = false;
        this.example = createRef();
        this.xx = [];
        this.onslot = (e) => {
            this.xx = [...e.target.assignedNodes({flatten: true})].map(x => x.cloneNode({deep: true}))
        }
    }
    render() {
        if(this.root && !this.classList.contains("inline-block")) {
            this.classList.add("inline-block")
        }
        const dir = html`
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`
        let M = this.xx.map(node => {
            if(!node.classList.contains("text-blue-500"))
            node.classList.add("text-blue-500")
            const name = node.getAttribute("name")
            let icon = node.dir ? folderIcon : fileIcon;
            let expand = html``;
            if(node.dir) {
                expand = html`<div class="transform -translate-x-4 absolute icons.expand">${expandIcon}</div>`
            }
            return html`
                <div class="px-3 block">
                    <div class="flex items-center">${expand}${icon} <div class="pl-2 flex-grow">${name}</div></div>
                ${node}
                </div>
            `;
        })
        return html`
            <div class="${this.root ? "border-solid border-3" : ""}">
            <slot name="file" class="hidden color-blue-500" @slotchange=${this.onslot}></slot>
            ${M}
            </div>
        `
    }
}
class Steps extends LitElement {
    constructor() {
        super();
    }
    render() {
        return html`
            <section class="text-gray-600 body-font">
                <div class="container px-5 py-24 mx-auto flex flex-wrap flex-col">
                    <div class="flex mx-auto flex-wrap mb-20">
                        <a class="sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium bg-gray-100 inline-flex items-center leading-none border-indigo-500 text-indigo-500 tracking-wider rounded-t">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>STEP 1
                        </a>
                        <a class="sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>STEP 2
                        </a>
                    </div>
                </div>
            </section>
        `
    }
}