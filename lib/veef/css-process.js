import fs from "fs"
import { getThisDir, pathJoin } from "./autoimport"

export default {
    name: 'css-process',
    transformIndexHtml(html, ctx, bundle) {
        return html.replace(/<link (.*?)>/gs, (all, src) => {
            return ``
        })
    },
    transform(code, file) {
        if(!pathJoin(file,"").startsWith(pathJoin(getThisDir(), "src")))
        return;
        // console.log(file)
        const [...rest] = [...code.matchAll(/class=(['"].*?['"])/gs)]
        // console.log(rest.map(x => x))
        // if(file.indexOf("node_modules/@material-design-icons") === -1) return;
        // return `export default \`${fs.readFileSync(file, {encoding: "utf8"})}\``
    }
}