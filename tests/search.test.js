import { before, describe, it } from "mocha"
import {setup, getVeef} from "./_setup.js"
import assert from "assert"

before(setup);

const Veef = getVeef();

it(`renders a field`, () => {
    const f = new Veef.SearchField()
    document.body.append(f);
    assert(f.shadowRoot.innerHTML.length > 0)
})

it(`does a good filter`, () => {
    const f = new Veef.SearchField()
    document.body.append(f);
    f.data = [{flt: "example", i: ["item", "one"]}, {flt: "example2", i: ["item", "two"]}]
    f.itemFilter = (i) => true;
    f.itemRender = (i) => JSON.stringify(i);
    f.dataFilterKey = "flt";
    f._lastRealValue = "ex"
    assert(f.filteredData.length === 2)
})

it(`renders suggestions`, () => {
    const f = new Veef.SearchField()
    document.body.append(f);
    f.data = [{flt: "example", i: ["item", "one"]}, {flt: "example2", i: ["item", "two"]}]
    f.itemFilter = (i) => true;
    f.itemRender = (i) => JSON.stringify(i);
    f.dataFilterKey = "flt";
    f._lastRealValue = "ex"
    assert(f.shadowRoot.innerHTML.indexOf(`example`) !== -1)

    // assert(f.shadowRoot.innerHTML.length > 0)
})