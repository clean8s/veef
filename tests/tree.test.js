import { before, describe, it } from "mocha"
import {setup, getVeef} from "./_setup.js"
import assert from "assert"

before(setup);

const Veef = getVeef();

it(`renders trees`, () => {
    const T = new Veef.Tree()
    T.connectedCallback()
    T.data = {
        "__unique_key": {
            "__unique_key2": 8
        }
    };

    assert.notEqual(T.shadowRoot.innerHTML.indexOf(`__unique_key`), -1)
})

it(`deterministic`, () => {
    const T = [new Veef.Tree(), new Veef.Tree()];
    T.map(x => {
        x.connectedCallback()
        x.data = {
            "__unique_key": {
                "__unique_key2": 8
            }
        };
    })

    assert.strictEqual(T[0].shadowRoot.innerHTML, T[1].shadowRoot.innerHTML)
})

it(`dark mode prop`, () => {
    const T = [new Veef.Tree(), new Veef.Tree()];
    T.map((x, idx) => {
        x.connectedCallback()

        if(idx === 0)
        x.dark = true;

        x.data = {
            "__unique_key": {
                "__unique_key2": 8
            }
        };
    })

    assert.notStrictEqual(T[0].shadowRoot.innerHTML, T[1].shadowRoot.innerHTML)
})

it(`dark mode attr`, () => {
    const T = [new Veef.Tree(), new Veef.Tree()];
    T.map((x, idx) => {
        x.connectedCallback()
        if(idx === 0)
        x.attributeChangedCallback("dark", "", "true")
        x.data = {
            "__unique_key": {
                "__unique_key2": 8
            }
        };
    })

    assert.notStrictEqual(T[0].shadowRoot.innerHTML, T[1].shadowRoot.innerHTML)
})