import {render} from "preact";

if(typeof window != 'undefined' && window['showcase']) {
    document.addEventListener('DOMContentLoaded', () => {
        render(<v-navwrap>{demos}</v-navwrap>, document.body);
    })
}