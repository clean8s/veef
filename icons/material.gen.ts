const fs = require("fs")

const fullSrc = ["filled", "outlined", "round", "sharp"].map(typ => {
    return fs.readdirSync(`../node_modules/@material-design-icons/svg/${typ}`).map((x: string) => {
        const iconName = `${typ}_${x.replace(".svg", "")}`
        return `import ${iconName} from "@material-design-icons/svg/${typ}/${x}"
export {${iconName}}`
    }).join("\n");
}).join("\n");

fs.writeFileSync("material.ts", fullSrc, {encoding: "utf8"})