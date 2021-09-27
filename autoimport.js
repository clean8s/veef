import fs from "fs"
import {fileURLToPath} from "url"
import {parse, dirname, join} from "path"

const OUTPUT = `showcase/showcase.tsx`
const SHOWCASE_CODE = (file, i) => `
/*
 * This file is autogenerated from vite
 * via autoimport.js
 * 
 * It contains all components from src/
*/

import "../src/${parse(file).name}"
import {Demo as Demo${i}} from "../src/${parse(file).name}"
demos.push(Demo${i})
`

const OUT_TEMPLATE = `
import {render} from "preact";
if(typeof window != 'undefined' && window['showcase']) {
  document.addEventListener('DOMContentLoaded', () => {
  render(<div>{demos}</div>, document.body);
  })
}
`

const thisDir = dirname(fileURLToPath(import.meta.url))

export default {
    name: "autoimport-plugin",
    transformIndexHtml: {
        transform: (code, ctx) => {
            return code.replace(`type="module" crossorigin`, "")
        },
    },
    buildStart() {
        this.lastCode = ""
        let hook = () => {
            const files = fs.readdirSync(`${thisDir}/src`).filter(x => {
                return x.endsWith(".tsx")
            }).map(SHOWCASE_CODE)
            const code = "const demos = [];\n\n" + files.join("\n") + OUT_TEMPLATE
            if(code === this.lastCode) {
                return;
            }
            fs.writeFileSync(`${thisDir}/${OUTPUT}`, code)
            this.lastCode = code;
        }
        hook()
        this.interval = setInterval(hook, 300)

    },
    buildEnd() {
        clearInterval(this.interval)
    }
}