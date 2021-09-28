import {render} from "preact";

if(typeof window != 'undefined' && window['showcase']) {
    document.addEventListener('DOMContentLoaded', () => {
        render(
        <v-navwrap>
            <v-menu items={{"Home label": "Home", "Other label": "Favorite", "A label with number": {
                icon: "Search",
                number: 10
            }}} />
            <section class="w-full p-4">
            <v-table main>
                    <v-table row head>
                    <v-table col>Some column head</v-table>
                    <v-table col>Some column head</v-table>
                    <v-table col>Some column head</v-table>
                </v-table>
                <v-table row>
                    <v-table col>Actual row col</v-table>
                    <v-table col>Another row's col</v-table>
                    <v-table col>Another row's col 123</v-table>
                </v-table>
            </v-table>
            </section>
        <v-dialog open/></v-navwrap>, document.body);
    })
}
            