const {transform, build} = require("esbuild")
const { fstat, readFileSync, rmSync } =  require("fs")
const {sync} = require("glob")
const {spawn} = require("child_process")

const getEntries = () => {
    return ["./main.tsx",  ...sync("*.{css,demo.js}"), ...sync("assets/*") ]
}
function buildSite() {
    const buildh = async () => {
        console.log("loading");
        getEntries().map(x => {
            try {
                delete require.cache[require.resolve(`./dist/${x}`.replace(/\.\w{2,4}$/, ".js"))]
            }catch(err) {
                // console.log(err)
            }
        });
        require("./dist/main.js")
    }

    build({
        entryPoints: getEntries(),
        watch: true,
        target: "node12",
        outdir: 'dist',
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