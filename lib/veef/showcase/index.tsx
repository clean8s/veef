import {Component, render, VNode} from "preact";
import {IconLibrary} from "../src/lib/icons"
import r from "preact-render-to-string"
import css1 from "../src/lib/comp.css"
import css2 from 'virtual:windi.css'

class Showcase extends Component<any, {dialogOpen, counter: number}> {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            counter: 0
        }
    }
    componentDidMount() {
        // setInterval(() => {
        // this.setState({counter : this.state.counter + 1})
        // }, 500)
    }
    openDialog() {
        this.setState({dialogOpen: !this.state.dialogOpen})
    }
    render(props) : VNode<any> {
        const icons = Object.keys(IconLibrary).map(x => {
            return <v-icon title={x} name={x} class="inline-block mx-2" iconClass="w-10 h-10 fill-current text-gray-500"/>
        })
        const TagName = ({name}) => <h1 class="tracking-wide font-bold mt-10 font-mono divide-y-4 divide-dashed"><div>{"<"}{name}{"/>"}</div><div/></h1>
        return (
            <>
            <v-nav>
            <a slot="logo">ReactCounter{this.state.counter}</a>
            <div slot="left">
            <a href="#" class="px-2 py-1 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded dark:text-gray-200 hover:bg-gray-900 hover:text-gray-100 md:mx-2">Home</a>
            <a href="#" class="px-2 py-1 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded dark:text-gray-200 hover:bg-gray-900 hover:text-gray-100 md:mx-2">About</a>
            <a href="#" class="px-2 py-1 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded dark:text-gray-200 hover:bg-gray-900 hover:text-gray-100 md:mx-2">Contact</a>
            </div>
            <div slot="right">
            <v-search class="A" inset={true}/>
            </div>
            </v-nav>
            <v-navwrap>
            <v-menu items={{"Home label": "Home", "Other label": "Like", "A label with number": {
                icon: "Search",
                number: 10
            }}} > zdravo <a slot="number">FFF</a> </v-menu>
            <section class="w-full p-4">
            The menu on the left is <code>{"<v-menu />"}</code>, the topbar is {"<v-nav />"}.
            
            <v-grid></v-grid>
            
            <TagName name="v-loader"/>
            <v-loader class="w-60 block my-5"/>
            <v-loader spinner class="text-green-300 ml-4" />
            <TagName name="v-search"/>
            <v-search class="my-4" />
            
            <TagName name="v-icon"/>
            {icons}
            
            <TagName name="v-infobox"/>
            
            <v-infobox class="my-3"><span slot="message">A warning message goes here</span></v-infobox>
            <v-infobox class="my-3" status="info"><span slot="message">An info message goes here</span></v-infobox>
            <v-infobox class="my-3" status="success"><span slot="message">A success message goes here</span></v-infobox>
            <v-infobox class="my-3" status="error"><span slot="message">An error message goes here</span></v-infobox>
            
            <TagName name="v-button"/>
            <v-button class="my-3" text="ABC" />
            <v-button class="my-3" text="ABC" disabled />
            
            <TagName name="v-dialog" />
            <button class="my-5 inline-block bg-gray-100 font-medium text-blue-500 border-blue-300 border-solid border-1 rounded p-2" onClick={() => this.openDialog()}>Toggle dialog</button>
            
            <TagName name="v-table" />
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
            
            <TagName name="v-list" />
            <v-grid cols={2}>
                <h1>yo</h1>
                <h1>g</h1>
                </v-grid>
            <v-tasks />
            </section>
            <v-dialog open={this.state.dialogOpen} onClose={() => this.openDialog()}/></v-navwrap></>
            );
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
        document.body.append(createCssNode())
        document.body.classList.add("loaded")
    })
    if(typeof window != 'undefined' && window['showcase']) {
        console.log(r(<Showcase/>))
        document.addEventListener('DOMContentLoaded', () => {
            render(<Showcase/>, document.body);
        })
    }
    
    import {createCssNode} from "../src/lib/rx"