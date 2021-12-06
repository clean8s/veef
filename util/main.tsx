import {render} from "preact-render-to-string"
import {h, Fragment, VNode, FunctionComponent} from "preact"
import {writeFileSync, readFileSync} from "fs"
//@ts-ignore
import prettyPrint from "pretty"
import nunjucks from "nunjucks"
const qq = '`'

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

const demo = (x, doSlot?: boolean, returnContent?: boolean) => {
    if(returnContent === true) return require(`./${x}.demo`)
    return <script {...(doSlot ? {slot: "h"}: {})} dangerouslySetInnerHTML={{__html: require(`./${x}.demo`)}} />
}

function Table() {
    return <>
    <div class="t1">
    
    <article class="text-center pad y-2">
        Try custom sort by clicking <strong style="color: var(--color)">on the third column.</strong>.
    </article>

    <v-table selectable id="tbl" autosort="0"  class="t1">
    <table>
    <tr>
        <td>Some num</td>
        <td>Some date</td>
        <td>Some color</td>
    </tr>
    <tr>
        <td>3</td>
        <td>20/01/2020</td>
        <td data-sort="2"><v-icon style="color: #FF3333" name="CircleFilled"></v-icon></td>
        
    </tr>
    <tr>
        <td>5367</td>
        <td>10/01/2020</td>
        <td data-sort="1"><v-icon style="color: #CC0000" name="CircleFilled"></v-icon></td>
        
    </tr>
    <tr>
        <td>251</td>
        <td>5/05/2022</td>
        <td data-sort="3"><v-icon style="color: #FF9999" name="CircleFilled"></v-icon></td>
        
    </tr>
    <tr>
        <td>938141</td>
        <td>01/01/1999</td>
        <td data-sort="4"><v-icon style="color: #f5dada" name="CircleFilled"></v-icon></td>
        
        </tr>
    </table>
</v-table>
<script dangerouslySetInnerHTML={{__html: `
tbl.addEventListener('rowselect', (e) => {
    dsc.innerText = "Selected rows: " + (e.detail.map(x => x.children[1].innerText).join(", ") || "none")
})
`}} />
</div>
<div class="t2">
    Event: <br/>
    <strong>rowselect:</strong> activated on any checkbox click and has <code>e.detail</code> which is <code>HTMLTableRow[]</code>. <br/>
    <hr />
    Attributes: <br/>
    <strong>selectable</strong> <br/>
    <strong>sortable</strong> <br/>
    <strong>autosort="column index"</strong><br/>
    Custom sort: <code>data-sort</code>
</div>
</>
}

function Tabs() {
    return <>
        <div class="t1">
            <button is="veef" id="createTab">Create tab</button>
        <v-tabs id="tabDemo">
            <button slot="tab" data-target=".t1">Some really really long label</button>
            <button slot="tab" data-target=".t2">And another really really long one</button>
            <button slot="tab" data-target=".t3">A short one</button>
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
    </>
}

function Alert() {
    return <div>
    <v-grid cols="2">
        <div><div class='t1'></div>
    <v-alert error="">This is an error message. You can put <strong>whatever HTML</strong> you like.</v-alert>
    <v-alert warning="">This is a warning. It means something, I think ...</v-alert>
    <v-alert success="">This is a success!</v-alert>
    <v-alert info="">This is an alert, a classic.</v-alert>
    </div>
    <div>
        <form id="toasty">
        <v-controls cols="2">
            <div>
                <label>Message</label>
            <input type="text" id="toastMsg" value="Some message" />
            </div>
            <div>
                <label>Duration</label>
                <v-grid cols="4" center>
                <input v-span="3" type="range" id="toastRange" min="300" max="10000" step="100" value="1500" ></input>
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
    </v-grid></div>;
}

function App() {
    return <>
    <nav>
        <p>Contents <v-icon onclick="document.body.classList.toggle('N')" class="ptr" name="Close"></v-icon></p>
        {["search", "dialog", "table", "tree", "icon", "tabs", "alert"].map(x => <a href={`#v-${x}`}><v-icon name="Bolt" />v-{x}</a>)}
        <a href="#license">License</a>
        <button onclick={`document.body.setAttribute('data-theme', 'dark')`}>dark mode</button>
    </nav>

    <div class="container showcase">
    <Component name="v-search" C={Search} info="smart fuzzy search"/>
    <Component name="v-dialog" C={Dialog} nocustom/>
    <Component name="v-table" C={Table} info="enhances any <code>table</code>, <code>tr</code>, <code>td</code>" rawinfo={true} />
    <Component name="v-tree" C={Tree}/>
    <Component name="v-icon" C={Icons}/>
    <Component name="v-tabs" C={Tabs} nocustom/>
    <Component name="v-alert" C={Alert} nocustom/>
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
            The most simple way to use it is to supply a JSON string as an attribute:
            <v-code lang="html">
                {`
                <v-tree data='{"some":"json"}'></v-tree>
                `}
            </v-code>
            You can also flip the color scheme by setting the dark attribute:
            <v-code lang="html">
                {`
                <v-tree dark data='{"some":"json"}'></v-tree>
                `}
            </v-code>
            <v-code lang="html">
            {`
            <script>
            {
              tree.data = {a: 5};
              tree5.renderLabel = (handler) => {
            }
            </script>
            `}
            </v-code>
            </div></>
}

function Dialog() {
    return <> 
    {/* <main> */}
        <div>
    <article class="pad x-2 text-center">
    Try closing it with <code>Esc</code>, the close icon or the area behind the modal.<br/><br/>

        <button is="veef" primary onclick="d1.open = true">
            <v-icon name="Menu"></v-icon>   Open dialog
        </button> {' '}
        <button is="veef" onclick="d2.open = true">
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
             <button is="veef" primary onclick="d1.open = false">Okay</button>
             <button is="veef" onclick="d1.open = false">Meh</button>
         </section>
     </v-dialog>
     <v-dialog id="d2">
         <div>
         <form>
             <v-controls cols="2">

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
             <button is="veef" onclick="d2.open = false">Okay</button>
         </section>
     </v-dialog>
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
            This <code>v-search</code> has 50 Queen songs that it autocompletes.
            You can type <strong>bo<span style="color: red">eh</span>man</strong> and you'll
            still find <strong>Bohemian Rhapsody</strong>!
        <v-search>
            <Template template="queen" tagName="template" slot="h"></Template>
        </v-search>
        <br/><br/>
        You can customize the style and write your own filter and rendering logic.
        <v-search>
            <Template template="searchStyle" tagName="style"></Template>
            <input class="main-input" type="text"
            slot="input" placeholder="Enter something here..."/>
            <v-icon style="color:#FF6666" slot="icon" name="Heart"></v-icon>
                <Template slot="h" template="customSearch" tagName="template" />
        </v-search>
        </div>
        </div>
        <div class="t2">
                {params.map(x => {
                    return <div><strong>{x[0]}</strong> <code>{x[1]}</code><div>{x[2]}</div> </div>;
                })}
            <v-code lang="html">
                {env.render("queen")}
            </v-code>
            </div>
            </>
}

function Component(props: {name: string, C: FunctionComponent, info?: string, nocustom?: boolean, rawinfo?: boolean}) {
    let hinfo = props.info || ""
    if(props.rawinfo === true) {
        //@ts-ignore
        hinfo = <span dangerouslySetInnerHTML={{__html: props.info}}></span>;
    }
    return <div id={props.name}><h2><b>{'<' + props.name + '>'}</b> <span style="color: #777; font-size: 1.3rem">{hinfo}</span></h2>
    <v-tabs via="style">
    <button slot="tab" role="tab">
        <v-icon name="Bolt"></v-icon> Demo
    </button>
    {props.nocustom ? null : 
    <button slot="tab"role="tab">
        <v-icon name="Code"></v-icon> Code & customization
    </button>}

        <props.C/>
        </v-tabs></div>
}

function page() {
    return render(<App/>)
}

function Icons() {
    return <>
        <div class="t1">
            <div class="pad y-2 text-center">
                v-icons contains a small curated list of icons.
            </div><v-icon all></v-icon>
    </div>
    <div>
    The syntax is just <code>{`<v-icon name="IconName"></v-icon>`}</code>.
        <ul>
<li>The color comes from the text color of the parent.</li>
<li>The size comes from the CSS width/height of the element.</li>
</ul>
<br/>
<aside>If you forget the names of the icons, you can just use {`<v-icon all>`} and it will show all the icons like in the demo below:</aside>

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
    });
    // return BASE;
    writeFileSync(out, BASE);
}

write("../index.html")

type ArbitraryProp = {[key in keyof JSX.IntrinsicAttributes]: any} & {[key in "slot"]: any}
function Template(props: {template: string, tagName: string, context?: object} & Partial<ArbitraryProp>) {
    // let Tag = tag
    const {template, tagName, context, ...rest} = props
    let Tag = tagName;
    const tpl = env.render(template, context || {})
    return <Tag dangerouslySetInnerHTML={{__html: tpl }} {...rest}></Tag>
}
// console.log(env.render("script1", {}));