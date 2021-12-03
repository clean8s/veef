const {transform, build} = require("esbuild")
const { fstat, readFileSync, rmSync } =  require("fs")
const {sync} = require("glob")
const {spawn} = require("child_process")

function buildSite() {
    const buildh = async () => {
        console.log("loading");
        spawn("yarn build", {
            cwd: "..",
            shell: true
        });
        ["./web.tsx",  ...sync("*.{css,demo.js}")].map(x => {
            try {
                delete require.cache[require.resolve(`./dist/${x}`.replace(/\.(js|css|tsx)/, ".js"))]
            }catch(err) {
                console.log(err)
            }
        });
        require("./dist/web.js")
    }

    build({
        entryPoints: ["./web.tsx",  ...sync("*.{css,demo.js}") ],
        watch: true,
        target: "node12",
        outdir: 'dist',
        jsx: "transform",
        bundle: false,
        format: "cjs",
        loader: {
            ".demo.js": "text",
            ".css": "text"
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