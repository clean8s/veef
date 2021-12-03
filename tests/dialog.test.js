import { before, describe, it } from "mocha"
import {setup, getVeef} from "./_setup.js"
import assert from "assert"

before(setup);

const Veef = getVeef();

it(`renders dialogs`, () => {
    const D = new Veef.Dialog();
    document.body.append(D);

    const heading = document.createElement("h1");
    heading.innerText = "Hello";
    D.append(heading);

    assert(D.shadowRoot.innerHTML.trim().length === 0)

    D.open = true;

    assert(D.shadowRoot.innerHTML.trim().length !== 0)
})

it(`does slotting`, () => {
    const D = new Veef.Dialog();
    document.body.append(D);

    const heading = document.createElement("h1");
    heading.innerText = "Hello";
    D.append(heading);

    D.open = true;

    assert(heading.assignedSlot != null)
})

it(`can be closed`, () => {
    const D = new Veef.Dialog();
    document.body.append(D);

    const heading = document.createElement("h1");
    heading.innerText = "Hello";
    D.append(heading);

    D.open = true;
    D.shadowRoot.querySelector(".cursor-pointer").click()
    D.render()

    assert(D.shadowRoot.innerHTML.trim().length === 0)
    assert(D.open === false)
})