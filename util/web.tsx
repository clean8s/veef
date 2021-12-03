import {render} from "preact-render-to-string"
import {h, Fragment, VNode, FunctionComponent} from "preact"
import {writeFileSync, readFileSync} from "fs"
//@ts-ignore
import prettyPrint from "pretty"
const qq = '`'

const demo = (x, doSlot?: boolean, returnContent?: boolean) => {
    if(returnContent === true) return require(`./${x}.demo`)
    return <script {...(doSlot ? {slot: "h"}: {})} dangerouslySetInnerHTML={{__html: require(`./${x}.demo`)}} />
}

function rawTag(tag: string, src: string, args?: Record<string, any>) {
    const R = args ? args : {};
    const T = tag;
    return <T {...R} dangerouslySetInnerHTML={{__html: src}} />
}

function Table() {
    return <>
    <div class="t1">
    <code id="dsc" style="display: inline-block">{`Selected rows: none`}</code>
    <v-table selectable id="tbl" autosort="2"  class="t1">
    <table>
    <tr>
        <td>Some num</td>
        <td>Some date</td>
        <td>Some name</td>
    </tr>
    <tr>
        <td>3</td>
        <td>20/01/2020</td>
        <td data-sort="2"><strong>Custom sort</strong>: <v-icon style="color: #FF3333" name="CircleFilled"></v-icon></td>
    </tr>
    <tr>
        <td>5367</td>
        <td>10/01/2020</td>
        <td data-sort="1"><strong>Custom sort</strong>: <v-icon style="color: #CC0000" name="CircleFilled"></v-icon></td>
    </tr>
    <tr>
        <td>251</td>
        <td>5/05/2022</td>
        <td data-sort="3"><strong>Custom sort</strong>: <v-icon style="color: #FF9999" name="CircleFilled"></v-icon></td>
    </tr>
    <tr>
        <td>938141</td>
        <td>01/01/1999</td>
        <td data-sort="4"><strong>Custom sort</strong>: <v-icon style="color: #f5dada" name="CircleFilled"></v-icon></td>
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
    return <div>
        <div class="t1">
        <v-tabs>
            <button data-target=".t1">A</button>
            <button data-target=".t2">B</button>
            <button data-target=".t3">C</button>
            <div slot="content">
                Some content
                <div class="t1"></div>
                <div class="t2"></div>
                <div class="t3"></div>
            </div>
        </v-tabs>
        </div>
    </div>
}

function Alert() {
    return <>
    <main>
        <div style="padding: 10px"><div class='t1'></div>
    <v-alert error="">This is an error message. You can put <strong>whatever HTML</strong> you like.</v-alert>
    <v-alert warning="">This is a warning. It means something, I think ...</v-alert>
    <v-alert success="">This is a success!</v-alert>
    <v-alert info="">This is an alert, a classic.</v-alert>
    </div>
        <v-code lang="html">{`
            ~v-alert success~Put any HTML here.~/v-alert~
            ~v-alert warning~Put any HTML here.~/v-alert~
            ~v-alert error~Put any HTML here.~/v-alert~
            ~v-alert info~Put any HTML here.~/v-alert~
        `}</v-code>
    </main></>;
}

function App() {
    return <>
    <header>
        <div class="container"><v-icon name="Bolt"></v-icon> veef Web Components
        <v-icon class="ptr" onclick="document.body.classList.toggle('N')" name="Menu"></v-icon></div>
        </header>

    <nav>
        <p>Contents <v-icon onclick="document.body.classList.toggle('N')" class="ptr" name="Close"></v-icon></p>
        {["search", "dialog", "table", "tree", "icon", "tabs", "alert"].map(x => <a href={`#v-${x}`}><v-icon name="Bolt" />v-{x}</a>)}
        <a href="#license">License</a>
    </nav>

    <div class="container showcase">
        <h3><strong>Web Components</strong> is a suite of Web APIs for
        making interactive components that are just HTML <code>&lt;tags&gt;</code>.
        </h3>
        <h3>Since they are just usual HTML, they are perfect for non-SPA frameworks like Django, Rails, Laravel.<br/>
            And you don't need to include build steps or tons of heavy frameworks, stylesheets and scripts.
        </h3>
    <Component name="v-search" C={Search} info="smart fuzzy search"/>
    <Component name="v-dialog" C={Dialog} nocustom/>
    <Component name="v-table" C={Table} info="<small style='font-size: 0.65em'>enhances any <code>table</code>, <code>tr</code>, <code>td</code></small>" rawinfo={true} />
    <Component name="v-tree" C={Tree}/>
    <Component name="v-icon" C={Icons}/>
    <Component name="v-tabs" C={Tabs} nocustom/>
    <Component name="v-alert" C={Alert} nocustom/>
    </div>
    </>
}

function Tree() {
    return <><div>
        <div class="t1">
         A collapsible tree that
         can be instantiated with a one liner <code>v-json</code>.
         It's useful for debugging REST APIs
         or letting users easily explore nested structures.
         Based around @redux/json-tree
         <main>
             <v-tree id="tree3"></v-tree>
             <v-tree dark id="tree4"></v-tree>
         </main>
         Furthermore, the way nodes are rendered can be customized to make it
         useful for specific structures:
         <v-tree id="tree5" initopen="(path,val)=> path.length < 3" style="display: block; max-width: 450px; overflow: hidden;
         border-radius: 10px; margin: 20px auto;"></v-tree>
     
         </div>
         {demo('tree')}
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
    return <main>
        <div class="t1">
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
        
        <section data-veef="actions">
            <button data-veef="primary" onclick="d1.open = false">Okay</button>
            <button data-veef onclick="d1.open = false">Meh</button>
        </section>
    </v-dialog>
    <v-dialog id="d2">
        {/* <v-icon name="Delete" data-veef="message"></v-icon> */}

        <div>
        <form data-veef style="--cols: 2;">
            <fieldset>
            <label>Some name</label>
            <input  />
            </fieldset>
            <fieldset>
            <label>Some date</label>
            <input type="date"/>
            </fieldset>
            <fieldset style="--span: span 2;">
                <label>Something else</label>
                <input />
            </fieldset>
        <div>

        </div>

            </form>
        </div>
        
        <section data-veef="actions">
            <button data-veef="primary" onclick="d2.open = false">Okay</button>
        </section>
    </v-dialog>


    <p>
    Try closing it with <code>Esc</code>, the close icon or the area behind the modal.<br/><br/>
        <button data-veef="primary" onclick="d1.open = true">
            <v-icon name="Menu"></v-icon>   Open dialog
        </button>
        <br/><br/>
        <button data-veef="primary" onclick="d2.open = true">
            <v-icon name="Edit"></v-icon> Open dialog with a form
        </button>

    </p>

        </div>  
        <v-code lang="html">
        {`
        ~v-dialog id="dlg1"~
          Some HTML
        ~/v-dialog~
        ~script~
          dlg1.open = true;
        ~/script~`}
        </v-code>
    </main>
}

function Search() {
    const params = [
        ["data", "object[]", "the items you want to autocomplete"],
        ["searchKey", "string",  "each item object must contain this key which will be used for indexing and filtering"],
        ["searchRender", "(item: object) => htm", "renders a single item"]
    ]
    return <div>
        <div class="t1" style="margin: 50px auto; max-width: 500px">
            This <code>v-search</code> has 50 Queen songs that it autocompletes.
            You can type <strong>boehman</strong> and you'll still find <strong>Bohemian</strong>!
        <v-search>
           {demo('search', true)}
        </v-search>
        <br/><br/>
        You can customize the behaviour and 
        you can customize <strong>different parts </strong>
        of the element using <code>slot=""</code> and write your own filter and rendering logic.
        <v-search>
            <template slot="style">
                <style>
                {`
            .main-input {
                background: #333;
                color: #fff;
            }
            .main-input::placeholder { color: #ccc; }
            .input-wrapper { background: #333; }
            .suggestion span { color: #333; }
            `}
                </style>
            </template>
            <v-icon style="color:#FF6666" slot="icon" name="Like"></v-icon>
            {rawTag('script', `(h) => this.placeholder = 'Some other placeholder'`, {'slot': 'h'})}
            {rawTag('script', `(h) => {
                this.data = [];
                this.itemTransform = (i) => {
                    return this.value.length != 0 ? i : []; 
                }
                this.addEventListener('input', () => {
                    this.data = ["You are typing: " + this.value, "Or are you...?"]
                })
            }
            `, {'slot': 'h'})}
        </v-search>
        </div>
        <div class="t2">
                {params.map(x => {
                    return <div><strong>{x[0]}</strong> <code>{x[1]}</code><div>{x[2]}</div> </div>;
                })}
            <v-code lang="html">
                {"<v-search>\n" + demo('search', false, true) + "</v-search>"}
            </v-code>
            </div>
    </div>
}

function Component(props: {name: string, C: FunctionComponent, info?: string, nocustom?: boolean, rawinfo?: boolean}) {
    let hinfo = props.info || ""
    if(props.rawinfo === true) {
        //@ts-ignore
        hinfo = <span dangerouslySetInnerHTML={{__html: props.info}}></span>;
    }
    return <div id={props.name}><h2><b>{'<' + props.name + '>'}</b> {hinfo}</h2>
    <v-tabs via="style">
    <button role="tab" data-target=":scope .blah .t1">
        <v-icon name="Bolt"></v-icon> Demo
    </button>
    {props.nocustom ? null : 
    <button role="tab" data-target=":scope .blah .t2">
        <v-icon name="Code"></v-icon> Code & customization
    </button>}
    
    <div slot="content" class="blah" style="border: 1px solid #ddd; margin: 0 3px; padding: 20px;">
        <props.C/>
    </div>
        </v-tabs></div>
}

function page() {
    return render(<App/>)
}

function Icons() {
    return <div>
        <div class="t1">
        The syntax is just <code>{`<v-icon name="IconName"></v-icon>`}</code>.
        <ul>
<li>The color comes from the text color of the parent.</li>
<li>The size comes from the CSS width/height of the element.</li>
</ul>
<br/>
<aside>If you forget the names of the icons, you can just use {`<v-icon all>`} and it will show all the icons like in the demo below:</aside>
<v-icon all></v-icon>
    </div></div>

}

function write(out: string) {
let BASE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="shortcut icon" href="data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP////tQEgAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQEAAAAACwAAAAAEAAQAAACK5QFGct8mEBrL6oZqpVT735sERWKV1aanGcu7OemcGy0ZD07MgfiZw/hYQoAOw==" />
    <meta name="og:image" content="summary" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:creator" content="@fikisipi" />
    <meta property="og:url" content="http://bits.blogs.nytimes.com/2011/12/08/a-twitter-for-my-sister/" />
    <meta property="og:title" content="veef Web Components" />
    <meta property="og:description" content="Useful data-oriented HTML components via a single 60KB import." />
    <meta property="og:image" content="https://clean8s.com/veef/og.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code&amp;family=Inter:wght@200;400;500;600&amp;display=swap" rel="stylesheet">
    <script>
        let exports = {};
    </script>
    <script src="./dist/index.js"></script>
    <style>$style-ref$</style>
    <title>veef Web Component kit</title>
</head>
<body class="N">
${page()}
</body>
</html>
` 
    const origs: string[] = [];
    let idx = -1;
    BASE = BASE.replaceAll(/<v-code.*?<\/v-code>/gs, (x) => {
        origs.push(x);
        return `$code-ref$`;
    });
    
    BASE = prettyPrint(BASE).replaceAll('$code-ref$', (_: any) => {
        idx++;
        return origs[idx]
    }).replaceAll('$style-ref$', require('./main'))
    writeFileSync(out, BASE);
}

write("../index.html")