import {Component, render, VNode} from "preact";

class Showcase extends Component<any, {dialogOpen}> {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false
        }
    }
    openDialog() {
        this.setState({dialogOpen: !this.state.dialogOpen})
    }
    render(props) : VNode<any> {
        return (
            <>
            <v-nav><a slot="logo">A</a></v-nav>
    <v-navwrap>
            <v-menu items={{"Home label": "Home", "Other label": "Favorite", "A label with number": {
                icon: "Search",
                number: 10
            }}} > zdravo <a slot="number">FFF</a> </v-menu>
            <section class="w-full p-4">
            
            <v-icon name="Warning" />
            <v-table main>
                <button class="my-5 inline-block bg-blue-100 font-bold text-blue-500 border-blue-300 border-solid border-1 rounded p-2" onClick={() => this.openDialog()}>Toggle dialog</button>
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
        <v-dialog open={this.state.dialogOpen} onClose={() => this.openDialog()}/></v-navwrap></>
        );
}
}
if(typeof window != 'undefined' && window['showcase']) {
    document.addEventListener('DOMContentLoaded', () => {
        render(<Showcase/>, document.body);
    })
}
            