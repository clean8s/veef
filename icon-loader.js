import fs from "fs"

export default {
    name: 'icon-loader',
    transform(code, file) {
        if(file.indexOf("node_modules/@material-design-icons") === -1) return;
        return `
import {createElement} from "preact"
import htm from "htm"
const H = htm.bind(createElement)

const Icon = ({size}) => H\`${fs.readFileSync(file, {encoding: "utf8"}).replace(`width="24" height="24"`, `class="fill-current" width=\${size || 24} height=\${size || 24}`)}\`
export default Icon;
`
    }
}