import {render} from "preact-render-to-string"
import {h, Fragment, VNode, FunctionComponent} from "preact"
import {writeFileSync, readFileSync} from "fs"
//@ts-ignore
import prettyPrint from "pretty"
import nunjucks from "nunjucks"

function Dropdown() {
    return <>
    <div>
        <Docs>
            <Template template="dropdemo" tagName="div" />
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
            To modify how an option is rendered, you need to define the <code>.transform(option, idx)</code> function.
            <br/>
            This react(ive) function should return a node using the <code>h`{"<b>${1+1}</b>"}`</code> <strong>literal syntax</strong>.
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
function Snippet(props: {code: string, width?: number, height?: number}) {
    props.code = dedent(props.code.replaceAll("~", "`")).replaceAll(/h'(.*?)'/g, (...groups: string[]) => {
        return "h`" + groups[1].replaceAll("{", "${") + "`"
    });
    let S = `min-width: 300px;`;
    if(props.height)
    S += "height: " + props.height + "px;";

    return <>
    <v-grid columns="2" style="align-items:start">
        <v-editor language="html" style={S} value={props.code} onchange="this.nextElementSibling.children[1].innerHTML = this.value"></v-editor>
        <div style={typeof props.width == 'undefined' ? "" : "max-width:" + (props.width) + "px" }>
        <span style="background:#eee; padding: 10px;margin: 0 auto 15px;display: block;"><v-icon name="Preview"></v-icon> Sandbox preview:</span>
        <div dangerouslySetInnerHTML={{__html: props.code}}/>
        </div>
        </v-grid>
        
    </>
}
function Docs(props: {children?: any}) {
    return <>
    <div style="padding: 20px; font-size: 1.1em">
    {props.children}
    </div>
    </>
}
function DocSection(props: {children: any}) {
    return <h2 style="text-align: left; padding-left: 15px; margin: 10px 0; font-size: 1.3em; border-left: 5px solid var(--color);">
        {props.children}</h2>
}

function DocAttr(props: {name: string, type: string, children: any}) {
    return <div>
        <strong>{props.name}</strong>
        <code>{props.type}</code>
        <br/>
        {props.children} 
        </div>
}

class MyLoader {
    // TODO: use a proper custom block definition
    getSource(name: string) {
        const fl = readFileSync("./assets/full.html", "utf8")
        // const fl = require("./assets/full")
        let src = ""
        const newFl = fl.replace(/{%\s*tpl\s*"(.*?)"\s*%}(.*?){%\s*endtpl\s*%}/gsm, (s: string, arg: string, body: string) => {
            if(arg === name) {
                src = body;
            }
            return ""
        })
        if(name === 'full') {
            return {src: newFl, path: name, noCache: true};
        }
        let path = name;
        return {src, path, noCache: true};
    }
}

const env = new nunjucks.Environment(new MyLoader())

function code(snippet: string, lang?: string) {
    const snip = snippet.replaceAll("~", "`");
    return <v-code lang={lang || "html"} style="margin: 20px 0;">{snippet}</v-code>
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
        <td data-sort="3"><v-icon style="color: #FF3333" name="CircleFilled"></v-icon></td>
        
    </tr>
    <tr>
        <td>5367</td>
        <td>2020/10/01</td>
        <td data-sort="4"><v-icon style="color: #CC0000" name="CircleFilled"></v-icon></td>
        
    </tr>
    <tr>
        <td>251</td>
        <td>2022/05/05</td>
        <td data-sort="2"><v-icon style="color: #FF9999" name="CircleFilled"></v-icon></td>
        
    </tr>
    <tr>
        <td>938141</td>
        <td>1999/01/01</td>
        <td data-sort="1"><v-icon style="color: #f5dada" name="CircleFilled"></v-icon></td>
        
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
</tr><tr>
<td>another one</td>
</tr><tr>
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
v-table.tiny::part(cell) {
    padding-top: 0.1em;
    padding-bottom: 0.1em;
}
v-table.tiny::part(cell-active) {
    background: #00000010;
    border-color: #00000010;
    font-weight: normal;
}
</style> */}
<script dangerouslySetInnerHTML={{__html: `
tbl.addEventListener('rowselect', (e) => {
    dsc.innerText = "Selected rows: " + (e.detail.map(x => x.children[1].innerText).join(", ") || "none")
})
`}} />
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
        `} />
    <DocSection>Selection event</DocSection>
    You can use JavaScript to detect when a row is selected with the <code>rowselect</code> event.
    A list of all rows is available in <code>event.detail</code>.
    {code(`
    <v-table id="myTable"> <table> .. </table> </div>
    <script>
    var t = document.getElementById('myTable');
    t.addEventListener('rowselect', (e) => {
        console.log(e.detail);
        // list of rows
    });
    </script>
    `)}
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
    `} />
    </Docs>
</div>
</>
}

function Tabs() {
    return <>
        <div class="t1" style="padding: 15px">
            <button is="v-primary" id="createTab">Create tab</button>
        <v-tabs id="tabDemo">
            <button slot="tab" style="filter: hue-rotate(90deg)" data-target=".t1">Some really really long label</button>
            <button slot="tab" style="filter: hue-rotate(90deg)" data-target=".t2">And another really really long one</button>
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
        <Template tagName="div" template="tabDemo" />
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
                `)} />
                <DocSection>Number of buttons must equal number of content elements</DocSection>
                The tab buttons must have <code>slot="tab"</code> while the content elements don't need anything. <br/><br/>
                <strong>Note that N tab buttons need N elements, ordered in the same sequence.</strong>
                <DocSection>Styling</DocSection>
                You can style buttons inside your page's CSS using usual <code>v-tabs > button{'{ .. }'}</code> rules.

            </Docs>
        </div>
    </>
}

function Alert() {
    return <>
    <div>
    <v-grid columns="2">
        <div><div class='t1'></div>
    <v-alert error="">This is an error message. You can put <strong>whatever HTML</strong> you like.</v-alert>
    <v-alert warning="">This is a warning. It means something, I think ...</v-alert>
    <v-alert success="">This is a success!</v-alert>
    <v-alert info="">This is an alert, a classic.</v-alert>
    </div>
    <div>
        <form id="toasty">
        <v-controls columns="2">
            <div>
                <label>Message</label>
            <input type="text" id="toastMsg" value="Some message" />
            </div>
            <div>
                <label>Duration</label>
                <v-grid columns="3" center>
                <input v-span="2" style="max-width: 120px" type="range" id="toastRange" min="300" max="10000" step="100" value="1500" ></input>
                <span v-span="1" id="toastRangeLabel" />
                </v-grid>
            </div>
            <div v-span="2">
                <button is="v-primary" type="submit" style="width: 100%">Create toast</button>
            </div>
        </v-controls>
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
            `} />
        </Docs>
        </div>
    </>;
}

function Utilities() {
    return <Docs>
                <v-card style="max-width: 250px; margin: 0 auto 20px;">
                    <strong>Some card</strong>
                    <v-card-divider></v-card-divider>
                    Some card content. <br/>
                    Blah blah.
                </v-card>

        <Snippet code={`
        <v-controls columns="2">
            <div>
                <label>Some name</label>
                <input>
            </div>
            <div>
                <label>Some date</label>
                <input type="date">
            </div>
            <div v-span="2">
                <label>Something else</label>
                <input>
            </div>

            <button is="v-primary">Action</button>
        </v-controls>
        `} />
    </Docs>
}
function App() {
    return <>
    <nav>
        <v-grid>
            <div>Contents</div>
                <div style="max-width: 50px;">
                    <v-icon class="ptr" onclick="document.body.classList.toggle('N')" style="color: #000; width: 20px; height: 20px;" name="Close"></v-icon>
                </div>
                </v-grid>
        {["v-search", "v-table", "v-dialog", "v-tree", "v-alert", "v-tabs", "v-icon", "utilities", "v-editor"].map(x => <a href={`#${x}`}>
            <v-icon name="Bolt" />{x}</a>)}
        <a href="#guide-web-components"><v-icon name="Help" /> Guide to Web Components</a>
        <a>Licensed under MIT.</a>
        
    </nav>

    <Component name="v-search" C={Search} info="smart fuzzy autocomplete" nocustom/>
    <Component name="v-dropdown" C={Dropdown} info="enhance your <select>"/>
    <Component name="v-table" C={Table} info="sortable and checkable datatable" rawinfo={true} />
    <Component name="v-dialog" C={Dialog} info="modals over the screen" />
    <Component name="v-tree" C={Tree} info="collapse/expand nested JSON" />
    <Component name="v-alert" C={Alert} info="info boxes and toasts" />
    <Component name="v-tabs" C={Tabs} info="clickable tabs"/>
    <Component name="v-icon" C={Icons} info="A small collection of icons" />
    <Component name="utilities" C={Utilities} info="tiny components" nocustom />
    <Component name="v-editor" C={Editor} info="A Monaco-based editor" />
    </>
}

function Editor() {
    return <>
    <div>
        <Docs>
        <h3 style="margin: 20px 0 30px;"><strong>Note: the syntax engine isn't built-in</strong>, it is loaded dynamically via CDN when you include this tag. </h3>
        Monaco, VS Code's engine is a very useful component for developer-oriented apps, but note that appending this component to your DOM will trigger
        500KB of network requests.
        <br/><br/>
        <v-editor value={dedent(`
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
        `)} />
        </Docs>
    </div>
    <div>
        <Docs>
            Use <code>&lt;v-editor&gt;&lt;/v-editor&gt;</code> to display the editor.
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
            `} height={100} />
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
            `} />
            </Docs>
            </div></>
}

function Dialog() {
    return <> 
    {/* <main> */}
        <div>
    <article class="pad x-2 text-center">
    Try closing it with <code>Esc</code>, the close icon or the area behind the modal.<br/><br/>

        <button is="v-primary"onclick="d1.open = true">
            <v-icon name="Menu"></v-icon>   Open dialog
        </button> {' '}
        <button is="v-secondary" onclick="d2.open = true">
            <v-icon name="Edit"></v-icon> Open dialog with a form
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
             <v-controls columns="2">
             <div>
             <label>Some name</label>
             <input />
             </div>
             <div>
             <label>Some date</label>
             <input type="date"/>
             </div>
             <div v-span="2">
                 <label>Something else</label>
                 <input />
             </div>
             </v-controls>
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
             `} height={350} />
             
        
        </Docs>
     </div>
     </>
}

function Search() {
    const params = [
        ["data", "object[]", "the items you want to autocomplete"],
        ["searchKey", "string",  "each item object must contain this key which will be used for indexing and filtering"],
        ["searchRender", "(item: object) => htm", "renders a single item"]
    ]
    return <><div>
        <div style="margin: 50px auto; max-width: 500px; font-size: 1.2rem;">
{/* 
            <v-dropdown>
                Pick something
                <v-item slot="option">
                    <v-icon name="Github" />
                    Kurac
                </v-item>
                </v-dropdown> <br/> */}

            This <code>v-search</code> has 50 Queen songs that it autocompletes.
            You can type <strong>bo<span style="color: red">eh</span>man</strong> and you'll
            still find <strong>Bohemian Rhapsody</strong>!
        <v-search>
        <input type="text"
            slot="input" placeholder="Enter something here..."/>
            <Template template="queen" tagName="template" slot="script"></Template>
        </v-search>
        <br/><br/>
        You can customize the style and write your own filter and rendering logic.
        <v-search class="dark-input">
            <Template template="searchStyle" tagName="style"></Template>
            <input class="main-input" type="text"
            slot="input" placeholder="Enter something here..."/>
            <v-icon style="color:#FF6666" slot="icon" name="Heart"></v-icon>
                <Template slot="script" template="customSearch" tagName="template" />
        </v-search>
        </div>
        </div>
        {/* <div class="t2">
            <Docs>
            {code(`
            <v-search>
              <input type="text" slot="input" placeholder="Enter something here..." />
              <template slot="script">
                <script>
                    this.data = ["a", "b", "c"];
                </script>
              </template>
            </v-search>
            `)}
            ["_itemToString", "_itemTransform", "_itemRender", "_data", "_searchKey", "_placeholder"]

                </Docs>
                {params.map(x => {
                    return <div><strong>{x[0]}</strong> <code>{x[1]}</code><div>{x[2]}</div> </div>;
                })}
            </div> */}
            </>
}

function Component(props: {name: string, C: FunctionComponent, info?: string, nocustom?: boolean, rawinfo?: boolean}) {
    let hinfo = props.info || ""
    if(props.rawinfo === true) {
        //@ts-ignore
        hinfo = <span dangerouslySetInnerHTML={{__html: props.info}}></span>;
    }
    return  <div class="element-docs" id={props.name}>
    <div class="container showcase">
        <h2 style="margin-top: 1rem"><b>{'<' + props.name + '>'}</b> <span style="font-size: 1.3rem">{hinfo}</span></h2>
    <v-tabs via="style">
    <button slot="tab" role="tab">
        <v-icon name="Bolt"></v-icon> Demo
    </button>
    {props.nocustom ? null : 
    <button slot="tab" role="tab">
        <v-icon name="Code"></v-icon> Code / sandbox
    </button>}

        <props.C/>
        </v-tabs></div> </div>
}

function page() {
    return render(<App/>)
}

function Icons() {
    return <>
        <div class="t1">
            <div class="pad y-2 text-center">
                <strong>v-icons contains a small curated list of icons. <sup><a href="#icon-notice">[1]</a></sup></strong>
            </div><v-icon all></v-icon>
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
            If you ever forget the name of an icon, you can use <code>&lt;v-icon all&gt;&lt;/v-icon&gt;</code> icon to show all the icons.
            </Docs>
    </div>
    </>

}

function write(out: string) {
let BASE = `

<!DOCTYPE html>
<html lang="en">
${env.render("head", {}).trim()}
${render(<App />)}
${env.render("footer", {})}
</body>
</html>
` 
    const origs: string[] = [];
    let idx = -1;
    BASE = BASE.replace("<script src=\"dist/index.js\"></script>", `<script src="dist/index.js?v${Math.random().toString(16).substring(3)}"></script>`)
    BASE = BASE.replaceAll(/<v-code.*?<\/v-code>/gs, (x) => {
        origs.push(x);
        return `/*code-ref*/`;
    });
    
    BASE = prettyPrint(BASE).replaceAll('/*code-ref*/', (_: any) => {
        idx++;
        return origs[idx]
    })

    BASE = BASE.replaceAll(/<style>(.*?)<\/style>/gs, (s: string, arg: string) => {
        return `<style>${arg.replaceAll(/$\s*/gsm, "")}</style>`;
    }).replace('"queen-json"', `[{"name":"Bohemian Rhapsody (1975)","value":"song-1"},{"name":"Under Pressure (with David Bowie) (1981)","value":"song-2"},{"name":"Killer Queen (1974)","value":"song-3"},{"name":"Radio Ga Ga (1984)","value":"song-4"},{"name":"Seven Seas of Rhye (1974)","value":"song-5"},{"name":"Another One Bites the Dust (1980)","value":"song-6"},{"name":"Don’t Stop Me Now (1979)","value":"song-7"},{"name":"We Will Rock You (1977)","value":"song-8"},{"name":"You’re My Best Friend (1976)","value":"song-9"},{"name":"Somebody to Love (1976)","value":"song-10"},{"name":"We Are the Champions (1977)","value":"song-11"},{"name":"Love of My Life (live at Festhalle Frankfurt, 2 February 1979) (1979)","value":"song-12"},{"name":"Spread Your Wings (1978)","value":"song-13"},{"name":"I Want to Break Free (1984)","value":"song-14"},{"name":"Who Wants to Live Forever (1986)","value":"song-15"},{"name":"Tie Your Mother Down (1977)","value":"song-16"},{"name":"Crazy Little Thing Called Love (1979)","value":"song-17"},{"name":"These Are the Days of Our Lives (1991)","value":"song-18"},{"name":"Now I’m Here (1975)","value":"song-19"},{"name":"Bicycle Race (1978)","value":"song-20"},{"name":"Fat Bottomed Girls (1978)","value":"song-21"},{"name":"The Show Must Go On (1991)","value":"song-22"},{"name":"Keep Yourself Alive (1973)","value":"song-23"},{"name":"Too Much Love Will Kill You (1996)","value":"song-24"},{"name":"Good Old Fashioned Lover Boy (1977)","value":"song-25"},{"name":"One Vision (1985)","value":"song-26"},{"name":"Play the Game (1980)","value":"song-27"},{"name":"I Want It All (1989)","value":"song-28"},{"name":"A Kind of Magic (1986)","value":"song-29"},{"name":"Save Me (1980)","value":"song-30"},{"name":"Hammer to Fall (1984)","value":"song-31"},{"name":"You Don’t Fool Me (1996)","value":"song-32"},{"name":"Let Me Live (1996)","value":"song-33"},{"name":"Back Chat (1982)","value":"song-34"},{"name":"A Winter’s Tale (1995)","value":"song-35"},{"name":"Innuendo (1991)","value":"song-36"},{"name":"Flash (1980)","value":"song-37"},{"name":"I’m Going Slightly Mad (1991)","value":"song-38"},{"name":"Thank God It’s Christmas (1984)","value":"song-39"},{"name":"Las Palabras de Amor (the Words of Love) (1982)","value":"song-40"},{"name":"It’s a Hard Life (1984)","value":"song-41"},{"name":"Breakthru (1989)","value":"song-42"},{"name":"Friends Will Be Friends (1986)","value":"song-43"},{"name":"Heaven for Everyone (1995)","value":"song-44"},{"name":"No One But You (Only the Good Die Young) (1998)","value":"song-45"},{"name":"Headlong (1991)","value":"song-46"},{"name":"Body Language (1982)","value":"song-47"},{"name":"Scandal (1989)","value":"song-48"},{"name":"The Invisible Man (1989)","value":"song-49"},{"name":"The Miracle (1989)","value":"song-50"}];`);
    // return BASE;
    writeFileSync(out, BASE);
}

write("../index.html")

type ArbitraryProp = Record<keyof HTMLElement, any> & {slot: any}
function Template(props: {template: string, tagName?: string, context?: object} & Partial<ArbitraryProp>) {
    // let Tag = tag
    const {template, tagName, context, ...rest} = props
    let fallback = "template"
    if(Object.keys(rest).find(x => x.startsWith("_"))) {
       fallback = Object.keys(rest).find(x => x.startsWith("_"))?.substring(1) as string; 
    }  
    let Tag = tagName || fallback;
    const tpl = env.render(template, context || {})
    return <Tag dangerouslySetInnerHTML={{__html: tpl }} {...rest}></Tag>
}

/**Given a Node.textContent, de-indents the
 * source code such that you can freely indent your HTML:
 * <code>
 *    const x = 1          <=>    <code>const x = 1</code>
 * </code>
 */
function dedent(code: string) : string {
let nonSpace = [...code].findIndex(x => !x.match(/\s/));
if (nonSpace === -1) {
    // No non-space characters
    return code
}

// The first newline is considered redundant
// because source usually looks like this:
//
// <code>
// code begins here
// </code>
if(code.startsWith('\n')) { 
    code = code.substring(1);
    nonSpace--;
}

const weight = (spc: string): number => {
    return spc.split('').reduce((acc, x) => {
    if (x === '\t') acc+= 4;
    else if(x.match(/\s/)) acc++;
    return acc
    }, 0)
};

const detectedSpace = code.substring(0, nonSpace);
const detectedWeight = detectedSpace.split('\n').reduce((acc, x) => {
    if (weight(x) > acc) acc = weight(x);
    return acc
    }, 0);

// const detectedWeight = weight(detectedSpace);

const restString = code.substring(nonSpace);
return restString.split("\n").map(x => {
    for(let i = 0; i < detectedWeight; i++) {
    if(x.length > 0 && x[0].trim().length === 0) {
        if(x[0] === '\t') {
        i += 3;
        }
        x = x.substring(1);
    }
    }
    return x;
}).join("\n").trim()
}