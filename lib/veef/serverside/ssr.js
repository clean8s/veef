
import {render} from '@lit-labs/ssr/lib/render-with-global-dom-shim.js';

import "../dist/veef.es.js"
import {html} from "lit";

function renderLit(lit) {
    const bufParts = [...render(lit)];
    return bufParts.join("");
}

function renderAndWrite() {
    const lit = html`<x-menu></x-menu><x-dialog open></x-dialog>`;
    const out = renderLit(lit);
    fs.writeFileSync("dist/ssr.html", out);
}

renderAndWrite()