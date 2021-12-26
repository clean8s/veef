import {Fragment, FunctionComponent, h} from "preact"
import {readFileSync} from "fs"
// import {dedent, write} from "./writer";
//@ts-ignore
import dedent from "dedent"

//@ts-ignore
globalThis["__internalFn"] = () => {
    //@ts-ignore
    globalThis.__q = [h, Fragment];
}

function Dropdown() {
    return <>
        <div>
            <Docs>
                {/*@raw
            <div style="text-align: center">
                This is a standard <code>&lt;select&gt;</code> wrapped in <code>&lt;v-dropdown&gt;</code>:

                <div style="text-align: center; margin: 2rem 0;">
                    <v-dropdown>
                        <select>
                            <option value="copy">Some copy operation</option>
                            <option value="bolt">A bolt</option>
                        </select>
                        <script slot="h">
                        h => {
                            this.transform = (x, idx) => h`<v-icon style='color: orange' name=${idx > 0 ? 'Bolt' : 'Copy'}/> ${x}`
                        }
                        </script>
                    </v-dropdown>
                </div>

                <div style="margin: 0 0 0.8em; padding: 0.8em 0 0; height: 0; border-bottom: 1px solid #cacaca;">
                </div>

                <v-grid cols="2">
                    <div style="max-width: 300px">
                        Enhance the component with <strong>custom rendering logic</strong> if JS is enabled:
                        <style>
                            .mid > v-dropdown{vertical - align: middle;}
                        </style>
                        <div style="text-align: center; margin: 2rem 0;" className="mid">
                            <span id="dropdemo"></span>

                            <v-dropdown>
                                <select>
                                    <option value="opt1">Some counter: 0</option>
                                    <option value="opt2">Some counter: 0</option>
                                    <option value="opt2">Some counter: 0</option>
                                </select>
                                <script slot="h">
                                    h => {
                                    let i = 1;
                                    setInterval(() => {
                                    this.transform = (x, idx) => h`<span style="color: #999; margin-right: 0.3rem;">Pick counter</span><br/><strong> ${(i * (idx + 1)).toString()}</strong>`
                                    i++;
                                    i %= 20;
                                }, 500);
                                }
                                </script>
                            </v-dropdown>
                        </div>
                    </div>
                    <div style="max-width: 300px; text-align: center;">
                        You can style the Shadow DOM using the <code>::part</code> CSS selector:
                        <div style="margin: 2rem auto">
                            <v-dropdown id="styled">
                                <select>
                                    <option>Item number one</option>
                                    <option>Item called item two</option>
                                    <option>Item three</option>
                                    <option>Lorem item</option>
                                    <option>Item opsum</option>
                                    <option>Another one</option>
                                    <option>This is a long list</option>
                                    <option>Or is it</option>
                                    <option>Item pickers are cool</option>
                                    <option>And so on</option>
                                    <option>Something</option>
                                </select>
                            </v-dropdown>
                            <style>
                                #styled::part(select) {
                                background: #FF6600;
                                border-color: #BF4600;
                                color: #fff;
                            }
                            </style>

                        </div>
                    </div>
                </v-grid>
            </div>*/}
            </Docs>
        </div>
        <div>
            <Docs>
                <h3>A basic example</h3>
                <Snippet width={170} code={`
                    <v-dropdown>
                        <select onchange="selectedInfo.innerText = 'change event: ' + this.value">
                            <option>Some option</option>
                            <option>Another option</option>
                        </select>
                    </v-dropdown> <br/><br/>
                    <div id="selectedInfo">onchange will appear here</div>
            `} />
                <h3>Custom rendering</h3>
                To modify how an option is rendered, you need to define the <code>.transform(option,
                idx)</code> function.
                <br/>
                This react(ive) function should return a node using the <code>h`{"<b>${1+1}</b>"}`</code> <strong>literal
                syntax</strong>.
                <br/>

                <Snippet width={170} code={`
            <v-dropdown>
            <select>
                <option value="opt1">One like</option>
                <option value="opt2">Two</option>
                <option value="opt2">Three</option>
            </select>
            <script slot="h">
            (h) => {
                this.transform = (x, idx) => h'<v-icon name="Like" /> {x}'
            };
            </script>
            </v-dropdown>
            
            `} />
            </Docs>
        </div>
    </>
}

function Snippet(props: { code: string, width?: number, height?: number }) {
    props.code = dedent(props.code.replaceAll("~", "`")).replaceAll(/h'(.*?)'/g, (...groups: string[]) => {
        return "h`" + groups[1].replaceAll("{", "${") + "`"
    });
    let S = `min-width: 300px;`;
    if (props.height)
        S += "height: " + props.height + "px;";

    return <>
        <v-grid columns="3" style="align-items:start">
            <div is={"span-2"}>
                <v-code language="html" style={S} value={props.code}
                        onchange="this.nextElementSibling.children[1].innerHTML = this.value"></v-code>
            </div>
            <div is="sm-span-3 md-span-3" style={typeof props.width == 'undefined' ? "" : "max-width:" + (props.width) + "px"}>
                <span style="background:#eee; padding: 10px;margin: 0 auto 15px;display: block;"><v-icon
                    name="Preview"></v-icon> Sandbox preview:</span>
                <div dangerouslySetInnerHTML={{__html: props.code}}/>
            </div>
        </v-grid>

    </>
}

function Docs(props: { children?: any }) {
    return <>
        <div style="padding: 20px; font-size: 1.1em">
            {props.children}
        </div>
    </>
}

function DocSection(props: { children: any }) {
    return <h2
        style="text-align: left; padding-left: 15px; margin: 10px 0; font-size: 1.3em; border-left: 5px solid var(--color);">
        {props.children}</h2>
}

function code(snippet: string, lang?: string) {
    const snip = snippet.replaceAll("~", "`");
    return <v-code language={lang || "html"} style="margin: 20px 0;">{snippet}</v-code>
}

function Table() {
    return <>
        <div class="t1">

            <article class="text-center pad y-2">
                Try custom sort by clicking <strong style="color: var(--color)">on the Color column.</strong>
            </article>
            <v-grid>
                <v-table selectable sortable id="tbl" class="t1">
                    <table>
                        <tr>
                            <td>Some num</td>
                            <td>Some date</td>
                            <td>Color</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>2020/01/20</td>
                            <td data-sort="3">
                                <v-icon style="color: #FF3333" name="CircleFilled"></v-icon>
                            </td>

                        </tr>
                        <tr>
                            <td>5367</td>
                            <td>2020/10/01</td>
                            <td data-sort="4">
                                <v-icon style="color: #CC0000" name="CircleFilled"></v-icon>
                            </td>

                        </tr>
                        <tr>
                            <td>251</td>
                            <td>2022/05/05</td>
                            <td data-sort="2">
                                <v-icon style="color: #FF9999" name="CircleFilled"></v-icon>
                            </td>

                        </tr>
                        <tr>
                            <td>938141</td>
                            <td>1999/01/01</td>
                            <td data-sort="1">
                                <v-icon style="color: #f5dada" name="CircleFilled"/>
                            </td>

                        </tr>
                    </table>
                </v-table>
                <v-table class="tiny">
                    <table>
                        <tr>
                            <td>tiny table</td>
                        </tr>
                        <tr>
                            <td>this is some row</td>
                        </tr>
                        <tr>
                            <td>another one</td>
                        </tr>
                        <tr>
                            <td>bites the dust</td>
                        </tr>
                    </table>
                </v-table>
            </v-grid>
            {/* @raw
<style>
v-table.tiny {
    display: flex;
    max-width: 300px;
    margin: 0 auto;
}
v-table.tiny::part(row):hover {
    background: #666;
}
v-table.tiny::part(row) {
    background: #444;
}
v-table.tiny::part(cell) {
    font-size: 0.85rem;
    padding-top: 0.13em;
    padding-bottom: 0.13em;
    border-color: #555;
    color: #ccc;
}
v-table.tiny::part(cell-header) {
    background: #222;
    color: #fff;
    font-weight: 400;
    border-color: #555;
}
v-table.tiny::part(cell-active) {
    background: #00000010;
    border-color: #00000010;
    font-weight: normal;
}
</style> */}
            <script dangerouslySetInnerHTML={{
                __html: `
tbl.addEventListener('rowselect', (e) => {
    dsc.innerText = "Selected rows: " + (e.detail.map(x => x.children[1].innerText).join(", ") || "none")
})
`
            }}/>
        </div>
        <div class="t2">
            <Docs>
                <Snippet code={`
    <v-table selectable sortable>
    <table>
      <tr>
        <th>Col 1</th>
        <th>Col 2</th>
      </tr>
      <tr>
        <td>A</td>
        <td>B</td>
      </tr>
      <tr>
        <td>C</td>
        <td>D</td>
      </tr>
    </table>
  </v-table>
        `}/>
                <DocSection>Attributes / props</DocSection>
                <strong>selectable</strong>: adds a checkbox for selecting rows <br/>
                <strong>sortable</strong>: sorts a column when you click on its header <br/>
                <strong>autosort="number"</strong>: the default column to sort by when the table is loaded <br/>
                <DocSection>Custom comparison</DocSection>
                <Snippet height={380} code={`
    <v-table sortable>
    <table>
    <tr><th>Col</th></tr>
    <tr><td>fourth</td></tr>
    <tr><td>first</td></tr>
    <tr><td>second</td></tr>
    <tr><td>third</td></tr>
    </table>
    <script slot="h">
        h => {
        let no = {first: 1, second: 2, third: 3, fourth: 4};
        this.compare = (a, b) => { // -1 if <, 1 if > and 0 if ==
            return no[a.innerText] < no[b.innerText] ? -1 : 1;
        }
        this.querySelector("th").click();
        };
    </script>
    </v-table>
    `}/>
            </Docs>
        </div>
    </>
}

function Tabs() {
    return <>
        <div class="t1" style="padding: 15px">
            <button is="v-primary" id="createTab">Create tab</button>
            <v-tabs id="tabDemo">
                <button slot="tab" style="filter: hue-rotate(90deg)" data-target=".t1">Some really really long label
                </button>
                <button slot="tab" style="filter: hue-rotate(90deg)" data-target=".t2">And another really really long
                    one
                </button>
                <button slot="tab" style="filter: hue-rotate(90deg)" data-target=".t3">A short one</button>
                <div class="t1">
                    <h1 class="text-center">Tab 1</h1>
                    <p class="text-center">
                        You got here because the tab <code>target</code> selector
                        matches the content.
                    </p>
                </div>
                <div class="t2 text-center">
                    <h1 class="text-center">Tab 2</h1>
                    <p>
                        Something.
                    </p>
                </div>
                <div class="t3 text-center">
                    <h1>Tab 3</h1>
                    <p>
                        Nothing interesting anymore.
                    </p>
                </div>
            </v-tabs>
            {/* @raw
            <script>
document.addEventListener("DOMContentLoaded", () => {
    createTab.addEventListener('click', () => {
        const btn = document.createElement("button");
        btn.slot = "tab";

        const vtabs = createTab.nextElementSibling;
        const i = Array.from(vtabs.querySelectorAll('button')).length + 1;
        btn.textContent = "Tab";
        let bq = Array.from(tabDemo.querySelectorAll("button"))
        bq[bq.length - 1].after(btn)

        const tab = document.createElement("div");
        // tab.style.display = 'none'
        tab.innerHTML = `<h1>This is tab #${i}</h1>`
        tab.style.display = 'none'
        tabDemo.append(tab)
    })

})
</script>
            */}
        </div>
        <div>
            <Docs>
                Using <code>v-tab</code> is just a matter of adding buttons and content in the right order as children:
                <Snippet code={(`
                <v-tabs>
                    <button slot="tab">Tab 1</button>
                    <button slot="tab">Tab 2</button>
                    <div>Content for Tab 1</div>
                    <div>Content for Tab 2</div>
                </v-tabs>
                `)}/>
                <DocSection>Number of buttons must equal number of content elements</DocSection>
                The tab buttons must have <code>slot="tab"</code> while the content elements don't need
                anything. <br/><br/>
                <strong>Note that N tab buttons need N elements, ordered in the same sequence.</strong>
                <DocSection>Styling</DocSection>
                You can style buttons inside your page's CSS using usual <code>{`v-tabs > button{'{ .. }'}`}</code> rules.

            </Docs>
        </div>
    </>
}

function Alert() {
    return <>
        <div>
            <v-grid columns="2">
                <div style="min-width: 300px;">
                    <div class='t1'></div>
                    <v-alert error="">This is an error message. You can put <strong>whatever HTML</strong> you like.
                    </v-alert>
                    <v-alert warning="">This is a warning. It means something, I think ...</v-alert>
                    <v-alert success="">This is a success!</v-alert>
                    <v-alert info="">This is an alert, a classic.</v-alert>
                </div>
                <div style="min-width: 300px;">
                    <form id="toasty">
                        <v-grid form columns="2">
                            <div>
                                <label>Message</label>
                                <input type="text" id="toastMsg" value="Some message"/>
                            </div>
                            <div>
                                <label>Duration</label>
                                <v-grid columns="3" center>
                                    <input is="span-2" style="max-width: 120px" type="range" id="toastRange" min="300"
                                           max="10000" step="100" value="1500"></input>
                                    <span is="span-1" id="toastRangeLabel"/>
                                </v-grid>
                            </div>
                            <div is="span-2">
                                <button is="v-primary" type="submit" style="width: 100%">Create toast</button>
                            </div>
                        </v-grid>
                    </form>
                </div>
                {/* <v-code lang="html">{`
            ~v-alert success~Put any HTML here.~/v-alert~
            ~v-alert warning~Put any HTML here.~/v-alert~
            ~v-alert error~Put any HTML here.~/v-alert~
            ~v-alert info~Put any HTML here.~/v-alert~
        `}</v-code> */}
            </v-grid>
        </div>
        <div>
            <Docs>
                <Snippet code={`
            <v-alert success>Some HTML here</v-alert>
            <v-alert warning>Some HTML here</v-alert>
            <v-alert error>Some HTML here</v-alert>
            <v-alert info>Some HTML here</v-alert>`} height={120}/>
                <DocSection>Toasts</DocSection>

                To create a toast, you need to put the <code>toast="1"</code> attribute in HTML
                or set the <code>toastElement.toast = true</code> JavaScript property.

                <Snippet code={`
            <v-alert info id="inf1">
                This is a toasty info.
            </v-alert>
            <button onclick="document.querySelector('#inf1').toast = true">
                Open as toast
            </button>
            `}/>
            </Docs>
        </div>
    </>;
}

function Utilities() {
    return <Docs>

        {/* @raw "style"
            .grid-demo > div {
                background: #262D35;
                padding: 0.8rem;
                color: #fff;
                font-size: 1.8rem;
                text-align: center;
            }
            
            */}

        Grid with <code>columns="4"</code> and D with <code>span="2"</code> <br/><br/>
        <v-grid columns="3" className="grid-demo">
            <div>
                A
            </div>
            <div>
                B
            </div>
            <div>
                C
            </div>
            <div is="span-2">
                D
            </div>
            <div>
                E
            </div>
            <div is="md-span-3">
                Will expand on small screens.
            </div>
            <v-card is="span-2">
                <strong>Some card</strong>
                <hr/>
                This is a card and it contains something.
                <div>
                    <img style="margin: 0; padding: 0; display: block" src="https://raw.githubusercontent.com/neutraltone/awesome-stock-resources/master/img/splash.jpg" width="100%"/>
                </div>
            </v-card>
        </v-grid>
        <v-grid form columns="2">
            <div>
                <label>Some name</label>
                <input/>
            </div>
            <div>
                <label>Some date</label>
                <input type="date"/>
            </div>
            <div>
                <label>Something else</label>
                <input/>
            </div>
            <div>
                <button>Button one</button>
                <button is="v-primary">Button two</button>
            </div>
        </v-grid>

    </Docs>
}

export function App() {
    return <>
        <nav>
            <v-grid>
                <div>Contents</div>
                <div style="max-width: 50px;">
                    <v-icon class="ptr" onclick="document.body.classList.toggle('N')"
                            style="color: #000; width: 20px; height: 20px;" name="Close"></v-icon>
                </div>
            </v-grid>
            {["v-search", "v-table", "v-dialog", "v-tree", "v-alert", "v-tabs", "v-icon", {"Form/Grid": "v-utils"}, "v-code"].map(x => {
                let link = "", name = "";
                if(typeof x == 'object') {
                    const [k, v] = Object.entries(x)[0]
                    name = k;
                    link = v;
                } else {
                    link = x;
                    name = x;
                }
                return <a href={`#${link}`}>
                    <v-icon name="Bolt"/>
                    {name}</a>
            })
            }
            <a href="#guide-web-components">
                <v-icon name="Help"/>
                Guide to Web Components</a>
            <a>Licensed under MIT.</a>

        </nav>

        <Component name="v-search" C={Search} info="smart fuzzy autocomplete" />
        <Component name="v-dropdown" C={Dropdown} info="enhance your <select>"/>
        <Component name="v-table" C={Table} info="sortable and checkable datatable" rawinfo={true}/>
        <Component name="v-dialog" C={Dialog} info="modals over the screen"/>
        <Component name="v-tree" C={Tree} info="collapse/expand nested JSON"/>
        <Component name="v-alert" C={Alert} info="info boxes and toasts"/>
        <Component name="v-tabs" C={Tabs} info="clickable tabs"/>
        <Component name="v-icon" C={Icons} info="A small collection of icons"/>
        <Component name="v-utils" C={Utilities} info="CSS only utilities" nocustom/>
        <Component name="v-code" C={Editor} info="A Monaco-based editor"/>
    </>
}

function Editor() {
    return <>
        <div>
            <Docs>
                <h3 style="margin: 20px 0 30px;"><strong>Note: the syntax engine isn't built-in</strong>, it is loaded
                    dynamically via CDN when you include this tag. </h3>
                Monaco, VS Code's engine is a very useful component for developer-oriented apps, but note that appending
                this component to your DOM will trigger
                500KB of network requests.
                <br/><br/>
                <v-code value={dedent(`
        /*
         * Put some JavaScript
         * over here.
         */
        const m = new Array(10).fill(0).map((x, i) => 2 * i);
        class WordCount extends HTMLParagraphElement {
            constructor() {
              // Always call super first in constructor
              super();
          
              // Element functionality written in here
          
              ...
            }
          }
        `)}/>
            </Docs>
        </div>
        <div>
            <Docs>
                Use <code>&lt;v-code&gt;&lt;/v-code&gt;</code> to display the editor.
                Attributes / properties:
                <ul>
                    <li><strong>value</strong>: get/set the current code shown</li>
                    <li><strong>language</strong>: get/set the language syntax</li>
                </ul>
                <DocSection>Accessing JS monaco instance</DocSection>
                <ul>
                    <li><strong>.editor</strong>: the monaco.editor instance</li>
                </ul>
                <DocSection>Events</DocSection>
                <ul>
                    <li><strong>change</strong>: when the buffer/code is changed</li>
                </ul>
            </Docs>
        </div>
    </>
}

function Tree() {
    return <>
        <div class="t1">
            <div class="pad y-2 text-center">
                Show <strong>JSON structures</strong> & API responses in tree structures.
            </div>
            <br/>
            <main>
                <v-tree dark id="tree3"></v-tree>
                {/* <v-code id="jsonData" lang="js" style="max-height: 180px; overflow: auto;">
                 {require('./assets/demojson')}
             </v-code> */}
                <v-tree id="tree5" initopen="(path,val)=> path.length < 3" style="display: block; max-width: 450px; overflow: hidden;
         border-radius: 10px; margin: 20px auto;"></v-tree>

            </main>

        </div>
        <div class="t2">
            <Docs>
                <DocSection>Simple JSON tree</DocSection>
                <Snippet code={`
            <v-tree dark data='{
                "some":"json", "here": [1, 2],
                "nested": {"banana": true, "apple": false}}
            '></v-tree>
            `} height={100}/>
                <DocSection>Custom labels</DocSection>
                <Snippet code={`
            <v-tree data='{
                "some":"json", "here": [1, 2],
                "nested": {"banana": true, "apple": false}}
            '>
             <script slot="h">
                (h) => {
                    this.renderLabel = (el) => h'DEMO {el.path[0]}';
                }
             </script>
            </v-tree>
            `}/>
            </Docs>
        </div>
    </>
}

function Dialog() {
    return <>
        {/* <main> */}
        <div>
            <article class="pad x-2 text-center">
                Try closing it with <code>Esc</code>, the close icon or the area behind the modal.<br/><br/>

                <button is="v-primary" onclick="d1.open = true">
                    <v-icon name="Menu"></v-icon>
                    Open dialog
                </button>
                {' '}
                <button is="v-secondary" onclick="d2.open = true">
                    <v-icon name="Edit"></v-icon>
                    Open dialog with a form
                </button>

            </article>

            <v-dialog id="d1">
                <v-icon name="Delete" data-veef="message"></v-icon>

                <div>
                    <h1>Some title</h1>
                    <h3>
                        Arbitrary HTML. The border on the left happens because
                        the host page has full control over the styling of the dialog
                        (which happens to add a border)
                        while the rest is controlled by veef.
                    </h3>
                </div>

                <section slot="actions">
                    <button is="v-primary" onclick="d1.open = false">Okay</button>
                    <button is="v-secondary" onclick="d1.open = false">Meh</button>
                </section>
            </v-dialog>
            <v-dialog id="d2">
                <div>
                    <form>
                        <v-grid form columns="2">
                            <div>
                                <label>Some name</label>
                                <input/>
                            </div>
                            <div>
                                <label>Some date</label>
                                <input type="date"/>
                            </div>
                            <div v-span="2">
                                <label>Something else</label>
                                <input/>
                            </div>
                        </v-grid>
                    </form>
                </div>
                <section slot="actions">
                    <button is="v-primary" onclick="d2.open = false">Okay</button>
                </section>
            </v-dialog>
        </div>
        <div>
            <Docs>
                <Snippet code={`
                         <v-dialog id="dl1">
                         <v-icon name="Delete" data-veef="message"></v-icon>
                         <div>
                           <h1>Some title</h1>
                           <h3>Put some content here.</h3>
                         </div>
                         <section slot="actions">
                            <button is="v-primary" onclick="d1.open = false">Okay</button>
                            <button is="v-secondary" onclick="d1.open = false">Meh</button></section>
                       </v-dialog>
                       <button is="v-primary"
                            onclick="dl1.open = true">Open</button>
             `} height={350}/>


            </Docs>
        </div>
    </>
}

function Search() {
    const params = [
        ["data", "object[]", "the items you want to autocomplete"],
        ["searchKey", "string", "each item object must contain this key which will be used for indexing and filtering"],
        ["searchRender", "(item: object) => htm", "renders a single item"]
    ]
    return <>
        <div>
            <div style="margin: 50px auto; max-width: 500px; font-size: 1.2rem;">

                Static page autocomplete with Fuzzy.js:<br/>
                You can type <strong>bo<span style="color: red">eh</span>man</strong> and you'll
                still find <strong>Bohemian Rhapsody</strong>!
                <v-search placeholder={"Search Queen songs..."}>

                    {
                        /* @raw "template slot='script'"
                        <script>
                        this.data = "queen-json"
                        this.searchKey = "name"
                        this.itemRender = (item, hl) => {
                            return h`<span><v-icon name="Headset" /> ${hl}</span>`
                        }
                        this.itemToString = (item) => {
                            return item.name
                        }
                        </script>
                         */
                    }
                </v-search>
                <br/><br/>
                You can customize the style and write your own filter and rendering logic.
                <v-search class="dark-input">
                    <style>
                        {`
.dark-input input { background: #333; font-size: 1rem; color: #fff; font-family: Inter; }
.dark-input input::placeholder { color: #aaa; }
.input-wrapper { background: #333; }
.suggestion span { color: #333; }
.dark-input::part(right-button), .dark-input::part(input-wrapper) {
    background: #333;
}
                `}
                    </style>
                    <input class="main-input" type="text"
                           slot="input" placeholder="Enter something here..."/>
                    <v-icon style="color:#FF6666" slot="icon" name="Heart"></v-icon>
                    {/*                 @raw "template slot='script'"
                <script>
                    this.data = [];
                   this.addEventListener('input', (e) => {
                    this.data = [this.value, "fake item 1", "fake item 2"];
                });

                        this.itemRender = (item, hl) => {
                            return h`<span>${item}</span>`
                        }
                </script>
                */}
                </v-search>
            </div>
        </div>
        <div class="t2">
            <Docs>

                <Snippet code={`
                <v-search placeholder="Search fruits">
                    <ul>
                        <li>Banana</li>
                        <li>Apple</li>
                    </ul>
                </v-search>`} />

            </Docs>
        </div>
    </>
}

function Component(props: { name: string, C: FunctionComponent, info?: string, nocustom?: boolean, rawinfo?: boolean }) {
    let hinfo = props.info || ""
    if (props.rawinfo === true) {
        //@ts-ignore
        hinfo = <span dangerouslySetInnerHTML={{__html: props.info}}></span>;
    }
    return <div class="element-docs" id={props.name}>
        <div class="container showcase">
            <h2 style="margin-top: 1rem"><b>{'<' + props.name + '>'}</b> <span>{hinfo}</span>
            </h2>
            <v-tabs via="style">
                <button slot="tab" role="tab">
                    <v-icon name="Bolt"></v-icon>
                    Demo
                </button>
                {props.nocustom ? null :
                    <button slot="tab" role="tab">
                        <v-icon name="Code"></v-icon>
                        Code / sandbox
                    </button>}

                <props.C/>
            </v-tabs>
        </div>
    </div>
}


function Icons() {
    return <>
        <div class="t1">
            <div class="pad y-2 text-center">
                <strong>v-icons contains a small curated list of icons. <sup><a
                    href="#icon-notice">[1]</a></sup></strong>
            </div>
            <v-icon all></v-icon>
            <div id="icon-notice">
                <sup>[1] - based on Material Icons by Google and Hero Icons by https://heroicons.com/</sup>
            </div>
        </div>
        <div>
            <Docs>
                The syntax for showing an icon:
                {code(`
            <v-icon name="Calendar"></v-icon>
            `)}
                Note that you must close the tag: <code>&lt;/v-icon&gt;</code> because of how Web Component API works.
                <DocSection>Changing color</DocSection>
                The icons inherit the text color from CSS. If your parent or the v-icon itself have a
                <code>color: #ff0000</code>, the icon will be red.
                <DocSection>Changing size</DocSection>
                The icons can be resized using the CSS <code>width</code> and <code>height</code> properties:
                {code(`
            <style>
            v-icon {
                width: 50px;
                height: 50px;
            }
            </style>
            `)}

                <DocSection>A cool trick</DocSection>
                If you ever forget the name of an icon, you can use <code>&lt;v-icon all&gt;&lt;/v-icon&gt;</code> icon
                to show all the icons.
            </Docs>
        </div>
    </>

}


