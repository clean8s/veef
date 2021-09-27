import { LitElement, html, css } from 'lit'

class Pages extends LitElement {
    static rootStyle = css`:host{display: inline-block; width: 500px;}`
    static get properties() {
        return {
            pages: { type: Array },
            pageList: { attribute: "pagelist", type: String }
        }
    }

    constructor() {
        super()
        this.pageList = "1, 2, 3"
        this.pages = [1, 2, 3];
    }

    render() {
        const pages = this.pageList.split(",").map((x, idx) => {
          return html`
              <button type="button" class="!outline-none w-full px-4 py-2 border-t border-b text-base ${idx == 0 ? "text-gray-600 font-bold" : "text-gray-500" } bg-white hover:bg-gray-100 ">
                  ${x}
              </button>`
        })
        return html`
            <div class="flex items-center select-none">
                <button type="button" class="w-full p-4 border text-base rounded-l-xl text-gray-600 bg-white hover:bg-gray-100">
                    <svg width="9" fill="currentColor" height="8" class="" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z">
                        </path>
                    </svg>
                </button>
                ${pages}
                <button type="button" class="w-full p-4 border-t border-b border-r text-base  rounded-r-xl text-gray-600 bg-white hover:bg-gray-100">
                    <svg width="9" fill="currentColor" height="8" class="" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z">
                        </path>
                    </svg>
                </button>
            </div>
        `
    }
}