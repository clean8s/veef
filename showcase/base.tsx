import {render} from "preact";

if(typeof window != 'undefined' && window['showcase']) {
    document.addEventListener('DOMContentLoaded', () => {
        render(<v-navwrap> <v-menu/> <v-myel /> <v-dialog open/></v-navwrap>, document.body);
    })
}