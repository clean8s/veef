import fs from "fs"

export default {
    name: 'icon-loader',
    transform(code, file) {
        if(file.indexOf("node_modules/@material-design-icons") === -1) return;
        return `export default \`${fs.readFileSync(file, {encoding: "utf8"})}\``
    }
}