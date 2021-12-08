import {render} from "preact-render-to-string"
import {h, Fragment, VNode, FunctionComponent} from "preact"
import {writeFileSync, readFileSync} from "fs"
//@ts-ignore
import prettyPrint from "pretty"
import nunjucks from "nunjucks"
const qq = '`'

function Docs(props: {children?: any}) {
    return <>
    <div style="padding: 20px; font-size: 1.1em">
    {props.children}
    </div>
    </>
}
function DocSection(props: {children: any}) {
    return <h2 style="text-align: left; padding-left: 15px; margin: 10px 0; font-size: 1.3em; border-left: 5px solid var(--color);">{props.children}</h2>
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
        Try custom sort by clicking <strong style="color: var(--color)">on the third column.</strong>.
    </article>

    <v-table selectable sortable id="tbl" class="t1">
    <table>
    <tr>
        <td>Some num</td>
        <td>Some date</td>
        <td>Some color</td>
    </tr>
    <tr>
        <td>3</td>
        <td>20/01/2020</td>
        <td data-sort="3"><v-icon style="color: #FF3333" name="CircleFilled"></v-icon></td>
        
    </tr>
    <tr>
        <td>5367</td>
        <td>10/01/2020</td>
        <td data-sort="4"><v-icon style="color: #CC0000" name="CircleFilled"></v-icon></td>
        
    </tr>
    <tr>
        <td>251</td>
        <td>5/05/2022</td>
        <td data-sort="2"><v-icon style="color: #FF9999" name="CircleFilled"></v-icon></td>
        
    </tr>
    <tr>
        <td>938141</td>
        <td>01/01/1999</td>
        <td data-sort="1"><v-icon style="color: #f5dada" name="CircleFilled"></v-icon></td>
        
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
    <Docs>
    <DocSection>Putting your &lt;table&gt; in v-table</DocSection>
    To make your table interactive, you need to put your table as a child:
    {code(`
    <v-table>
      <table>
        <tr>
          <th>Col 1</th>
          <th>Col 2</th>
        </tr>
        <tr>
          <th>Row 1, 1</th>
          <th>Row 1, 2</th>
        </tr>
      </table>
    </v-table>
    `)}
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
    </Docs>
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
                {code(`
                <v-tabs>
                    <button slot="tab">Tab 1</button>
                    <button slot="tab">Tab 2</button>
                    <div>Content for Tab 1</div>
                    <div>Content for Tab 2</div>
                </v-tabs>
                `)}
                The tab buttons must have <code>slot="tab"</code> while the content doesn't need a slot attribute,
                but the length of the slotted buttons and the content elements (which don't have to be <code>div</code>) must match.
                <br/><br/>
                You can style your buttons inside your page's CSS.
                <br/><br/>
                TODO: Explain the styling of the shadow parts.

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
            To display an alert:
            {code(`
            <v-alert success>Some HTML here</v-alert>
            <v-alert warning>Some HTML here</v-alert>
            <v-alert error>Some HTML here</v-alert>
            <v-alert info>Some HTML here</v-alert>`)}
            <DocSection>Toasts</DocSection>
            Toasts are a special kind of alerts displayed in the bottom right corner of the screen
            for a limited amount of time.
            <br/><br/>
            To create a toast, you need to put the <code>toast="1"</code> attribute in HTML
            or set the <code>toastElement.toast = true</code> JavaScript property. The duration
            is set similarly (<code>duration</code>)
        </Docs>
        </div>
    </>;
}

function Utilities() {
    return <Docs>
        v-code can syntax highlight code snippets for javascript, css and html:
        {code('<v-code lang="javascript">snippet here</v-code>')}
        v-controls provides nice input controls, buttons and labels:
        {code(`
        <form>
            <v-controls columns="2">
                <div><label>Some name</label> <input> </div>
                <div><label>Some date</label> <input type="date" /> </div>
                <div v-span="2"><label>Something else</label> <input> </div>
                <div v-span="2"> <button>My btn</button> </div>
            </v-controls>
        </form>
        `, 'html')}
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
        {["search", "table", "dialog", "tree", "alert", "tabs", "icon", "utilities"].map(x => <a href={
            (x == 'utilities' ? '#' : '#v-') + `${x}`}><v-icon name="Bolt" />{x == 'utilities' ? "" : "v-"}{x}</a>)}
        <a href="#guide-web-components"><v-icon name="Help" /> Guide to Web Components</a>
        <a>Licensed under MIT.</a>
        
    </nav>

    <Component name="v-search" C={Search} info="smart fuzzy autocomplete"/>
    <Component name="v-table" C={Table} info="enhances any <code>table</code>, <code>tr</code>, <code>td</code>" rawinfo={true} />
    <Component name="v-dialog" C={Dialog} info="modals over the screen" />
    <Component name="v-tree" C={Tree} info="collapse/expand nested JSON" />
    <Component name="v-alert" C={Alert} info="info boxes and toasts" />
    <Component name="v-tabs" C={Tabs} info="clickable tabs"/>
    <Component name="v-icon" C={Icons} info="A small collection of icons" />
    <Component name="utilities" C={Utilities} info="tiny components" nocustom />
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
             The only thing needed to make a dialog is the HTML inside it.
             Example:
        {code(`
        <v-dialog id="myDialog">
        This is a <b>dialog</b>
        </v-dialog>
        `)}
        <DocSection>Opening/closing a dialog</DocSection>
        In order to open a dialog you can either use the <code>open="1"</code> HTML attribute or
        the <code>element.open</code> JavaScript property:
        {code(`
        document.getElementById('myDialog').open = true;
        // or <v-dialog open="true" ...
        `, 'javascript')}
        <DocSection>Styling</DocSection>
        The <code>v-dialog</code> element uses the original style of the children you pass to it, and then centers the
        children evenly. <br/>

        It can also center and stretch buttons for actions, which can be done using the slot <code>slot="actions"</code>. A full example
        with icons, text and actions:
        {code(`
                    <v-dialog id="d1">
                    <v-icon name="Delete" data-veef="message"></v-icon>
                    <div>
                      <h1>Some title</h1>
                      <h3>Arbitrary HTML. The border on the left happens because the host page has full control over the styling of the dialog (which happens to add a border) while the rest is controlled by veef.</h3>
                    </div>
                    <section slot="actions">
                      <button primary onclick="d1.open = false">Okay</button>
                      <button onclick="d1.open = false">Meh</button></section>
                  </v-dialog>`)}
        
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
        <div class="t2">
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
    <button slot="tab" role="tab">
        <v-icon name="Code"></v-icon> Code & component docs
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
// console.log(env.render("script1", {}));