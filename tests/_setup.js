import {JSDOM} from "jsdom"

const dom = new JSDOM();
global._dom = dom;
global.document = dom.window.document;
global.window = dom.window;
global.Document = dom.window.Document;

global.HTMLElement = dom.window.HTMLElement;
global.customElements = dom.window.customElements;
global.requestAnimationFrame = (x) => x()
global.CSSStyleSheet = dom.window.CSSStyleSheet;
CSSStyleSheet.prototype.replace = (x) => 0;
Document.prototype.adoptedStyleSheets = [];


export async function setup() {
    globalThis.Veef = await import("../dist/index.mjs")
    globalThis.Veef = Veef;
};

/**@type { () => import("../index") }*/
export function getVeef() {
    return new Proxy({}, {
        get: (t, prop) => {
            return globalThis.Veef[prop];
        }
    });
}