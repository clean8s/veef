const {transform, build} = require("esbuild")
const { fstat, readFileSync, rmSync } =  require("fs")
const {sync} = require("glob")
const {spawn} = require("child_process")
const fs = require("fs")

const getEntries = () => {
    return ["main.tsx", "./dist/main.tsx",  ...sync("*.{css,demo.js}"), ...sync("assets/*") ]
}
function buildSite() {
    fs.statSync("./dist", {throwIfNoEntry: false}) || fs.mkdirSync("./dist");

    const buildh = async () => {
        getEntries().map(x => {
            try {
                delete require.cache[require.resolve(`./dist/${x}`.replace(/\.\w{2,4}$/, ".js"))]
            }catch(err) {
                // console.log(err)
            }
        });
        const src = fs.readFileSync("./main.tsx", "utf8");

        const C = src.replace(/{\s*\/\*\s*@raw\s*(.*?)\*\/\s*}/gsm, (match, p1) => {
            return `<div dangerouslySetInnerHTML={{__html: ${JSON.stringify(dedent(p1))}}}/>`
        });
        fs.writeFileSync("./dist/main.tsx", C);

        // console.log([...C].map(x => dedent(x[1])))
        if(fs.statSync("./dist/dist/main.js", {throwIfNoEntry: false})) {
            console.log("Loading..")
            require("./dist/dist/main.js")
        }
    }

    buildh();
    build({
        entryPoints: getEntries(),
        watch: true,
        target: "node12",
        outdir: 'dist',
        minify: false,
        jsx: "transform",
        bundle: false,
        format: "cjs",
        loader: {
            ".demo.js": "text",
            ".jsx": "text",
            ".css": "text",
            ".html": "text",
            ".json": "text"
        },
        jsxFactory: "h",
        jsxFragment: "Fragment",
        watch: {
            onRebuild: async function() { await buildh(); }
        }
    }).then(x => buildh()).catch(x => {
        throw x;
    })
}

buildSite()

function dedent(code) {
    let nonSpace = [...code].findIndex(x => !x.match(/\s/));
    if (nonSpace === -1) {
        // No non-space characters
        return code;
    }
    // The first newline is considered redundant
    // because source usually looks like this:
    //
    // <code>
    // code begins here
    // </code>
    if (code.startsWith('\n')) {
        code = code.substring(1);
        nonSpace--;
    }
    const weight = (spc) => {
        return spc.split('').reduce((acc, x) => {
            if (x === '\t')
                acc += 4;
            else if (x.match(/\s/))
                acc++;
            return acc;
        }, 0);
    };
    const detectedSpace = code.substring(0, nonSpace);
    const detectedWeight = detectedSpace.split('\n').reduce((acc, x) => {
        if (weight(x) > acc)
            acc = weight(x);
        return acc;
    }, 0);
    // const detectedWeight = weight(detectedSpace);
    const restString = code.substring(nonSpace);
    return restString.split("\n").map(x => {
        for (let i = 0; i < detectedWeight; i++) {
            if (x.length > 0 && x[0].trim().length === 0) {
                if (x[0] === '\t') {
                    i += 3;
                }
                x = x.substring(1);
            }
        }
        return x;
    }).join("\n").trim();
}
