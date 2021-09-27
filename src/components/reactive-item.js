import {css, html, LitElement} from "lit";

class Item extends LitElement {
    static rootStyle = css``

    static get properties() {
        return {
            name: {type: String},

            value: { type: String},

            ch: {type: Array, attribute: false},
            serialized: {type: Object, reflect: true}
        }
    }

    constructor() {
        super();
        this.type = ""
        this.name = ""
        this.serialized = {}

        this.ch = [];
    }

    render() {
        return html` `;
    }

    firstUpdated() {
        this.serialized = this.data()
        this.requestUpdate("el-eval", null)
        this.performUpdate()
        // if(this.value != "list") {
        //     new MutationObserver(() => {
        //         this.requestUpdate("el-eval", null)
        //         this.performUpdate()
        //     }).observe(this, {childList: true})
        // } else {
        //     setTimeout(() => {
        //         this.requestUpdate("el-eval", null)
        //         this.performUpdate()
        //     }, 10)
        // }
    }

    updated(ch) {
        if(ch.has("serialized") && [...ch.keys()].length === 1)
        return;

        this.serialized = this.data()
        if(this.parentElement && typeof this.parentElement.extra == 'object') {
            this.parentElement.extra = this.serialized
        } else if(this.parentElement && this.parentElement.requestUpdate) {
            this.parentElement.requestUpdate("el-val", null)
            this.parentElement.performUpdate()
        }
    }

    data() {
        const children = [...this.children].filter(x => x.tagName == "X-ITEM");
        const response = {};
        let name = this.name;

        if(this.value == "list") {
            response[name] = children.map(x => x.data())
        }
        if(this.value == "object") {
            response.type = "object"
            let obj = {}
            children.forEach(ch => {
                if(ch.hasOwnProperty("name"))
                obj[ch.name] = ch.data();
            })
            response[name] = obj
        }
        if(this.value == "string") {
            response[name] = this.textContent.trim()
        }
        if(this.value == "int") {
            response[name] = parseInt(this.textContent.trim(), 10)
        }
        if(this.value == "bool") {
            response[name] = this.textContent.trim() === "true"
        }

        if(this.value == "dom") {
            response[name] = [...this.childNodes].map(x => x.nodeType === 1 ? (x.innerHTML) : x.wholeText)
        }

        return response
    }
}