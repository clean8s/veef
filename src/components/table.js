import { LitElement, html, css } from 'lit'
import {createRef, ref} from "lit/directives/ref.js";

class Icon extends LitElement {
    render() {
        return html`<div>yo${addicon}</div>`
    }
}

import addicon from "icons:add_box"

class Table extends LitElement {
    static rootStyle = css`:host{display: inline-block; width: 500px;}`
    static get properties() {
        return {
            pages: { type: Array },
            pageList: { attribute: "pagelist", type: String },
            rows: { type: Array }
        }
    }

    constructor() {
        super()
        this.pageList = "1, 2, 3"
        this.pages = [1, 2, 3];
        this.mref = createRef();
        this.rows = [];
    }
    updated() {
        if(this.rows.length) return;
        // setTimeout(() => {
        const allrows = [];
            [...this.children].map(x => {
                [...x.querySelectorAll('tr')].map(x => {
                  const cols = [...x.querySelectorAll('td')].map(x => x.innerText)
                    allrows.push(cols)
                })
                // const newx = x.cloneNode(true);
                // newx.classList.add("p-6")
                // this.mref.value.innerHTML += newx.outerHTML
            })
            this.rows = allrows;
            // this.update()
        // }, 100)
    }


    render() {
        const addcls = (e) => {
            [...(e.target.assignedNodes({flatten: true}))].map(x => {
              x.classList.add(...e.target.classList.values())
            })
        }
        const pages = this.pageList.split(",").map((x, idx) => {
          return html`
              <button type="button" class="!outline-none w-full px-4 py-2 border-t border-b text-base ${idx == 0 ? "text-gray-600 font-bold" : "text-gray-500" } bg-white hover:bg-gray-100 ">
                  ${x}
              </button>`
        })
        return html`
            <!-- component -->
            <section class="container mx-auto p-6 font-mono">
                <div class="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                    <div class="w-full overflow-x-auto">
                        <table class="w-full">
                            <thead>
                            <tr class="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">

                            </tr>
                            </thead>
                            <tbody class="bg-white">

                            
                            <tr class="text-gray-700">
                                <td class="px-4 py-3 border">
                                    <div class="flex items-center text-sm">
                                        <div class="relative w-8 h-8 mr-3 rounded-full md:block">
                                            <img class="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                                            <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                        </div>
                                        <div>
                                            <p class="font-semibold text-black">Sufyan</p>
                                            <p class="text-xs text-gray-600">Developer</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-ms font-semibold border">22</td>
                                <td class="px-4 py-3 text-xs border">
                                    <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                                </td>
                                <td class="px-4 py-3 text-sm border">6/4/2000</td>
                            </tr>
                        
                            <tr class="text-gray-700">
                                <td class="px-4 py-3 border">
                                    <div class="flex items-center text-sm">
                                        <div class="relative w-8 h-8 mr-3 rounded-full">
                                            <img class="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                                            <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                        </div>
                                        <div>
                                            <p class="font-semibold">Sami</p>
                                            <p class="text-xs text-gray-600">Developer</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3 border text-md font-semibold">21</td>
                                <td class="px-4 py-3 border text-xs">
                                    <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                                </td>
                                <td class="px-4 py-3 border text-sm">6/10/2020</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        `
    }
}