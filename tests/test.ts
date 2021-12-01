import * as esbuild  from "esbuild"
const fs = require('fs');

let out = esbuild.transformSync(fs.readFileSync('index.tsx', 'utf8'), {
    jsx: "transform",
    loader: "tsx",
    format: "cjs"
});

eval(out.code)
// esbuild.buildSync({
//     entryPoints: ["./index.tsx"],
//     outfile: "./index.bundle.js"
// })