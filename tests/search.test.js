import { before, describe, it } from "mocha"
import {setup, getVeef} from "./_setup.js"
import assert from "assert"

before(setup);

const Veef = getVeef();

it(`works`, () => {
    const f = new Veef.SearchField()
    // f.connectedCallback()
    document.body.append(f);
    f.data = [1, 2, 3]
    f.itemFilter = (i) => false;
    console.log(f.shadowRoot.innerHTML)
})