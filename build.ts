import { Processor } from 'windicss/lib'
const fs = require('fs')
const path = require('path')
import { createUtils, UserOptions } from '@windicss/plugin-utils'

async function generateStyles(html: string) {
  let K = createUtils()
  await K.ensureInit()
  let out = await K.applyExtractors(html)
  
  // Get windi processor
  const processor = new Processor()
  
  const htmlClasses = (out.classes as string[]).join(' ')
  
  // Generate preflight based on the html we input
  const preflightSheet = processor.preflight(html)
  
  // Process the html classes to an interpreted style sheet
  const interpretedSheet = processor.interpret(htmlClasses).styleSheet
  
  // Build styles
  const APPEND = false
  const MINIFY = false
  const styles = interpretedSheet.extend(preflightSheet, APPEND).build(MINIFY)
  
  //@ts-ignore
  return minifyCss(styles);
}

const minifyCss = (someCss: string) : string => {
  return (new (require("clean-css"))({})).minify(someCss).styles;
}

import { sync as globSync } from 'glob'
import { readFileSync, writeFileSync } from 'fs'

type ResolveArgs = {importer: string, path: string};

let preactAlias = {
  name: 'preact-alias',
  setup(build: any) {
    let path = require('path')

    // build.onStart(() => {
    //   console.log(build)
    // })
    
    let jsfiles = globSync('**/*.tsx', {
      dot: false,
      nodir: true,
      ignore: ['.git/*', 'node_modules/**/*'],
    })
    
    build.onResolve({ filter: /^virtual:material-icons$/ }, (args: ResolveArgs) => {
      const script: string = fs.readFileSync(args.importer as string, 'utf8');
      const iconList = Array.from(script.matchAll(/icon_[a-zA-Z0-9_-]+/g)).map((match: string[]) => {
        return match[0].replace('icon_', '')
        // console.log(icon)
      })

      // console.log(args)
      return {
        path: args.path.replace('virtual:', ''),
        namespace: 'material-icons',
        pluginData: iconList
      }
    })

    build.onResolve({ filter: /^virtual:windi$/ }, (args: ResolveArgs) => {
      // const srcJs = fs.readFileSync(args.importer as string, 'utf8')

      return {
        path: args.importer,
        namespace: 'windi',
      }
    })

    build.onLoad({filter: /veef.*?\.css/}, async (x: any) => {
      return { contents: minifyCss(readFileSync(x.path, 'utf8')), loader: 'text' }
    });

    build.onResolve({ filter: /^base16/ }, (args: ResolveArgs) => {
      return {
        path: "base16",
        namespace: "base16"
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'base16'}, async (x: any) => {
      console.log(x)
      return {
        contents: `let monokai = { "scheme": "monokai", "author": "wimer hazenberg (http://www.monokai.nl)", "base00": "#272822", "base01": "#383830", "base02": "#49483e", "base03": "#75715e", "base04": "#a59f85", "base05": "#f8f8f2", "base06": "#f5f4f1", "base07": "#f9f8f5", "base08": "#f92672", "base09": "#fd971f", "base0A": "#f4bf75", "base0B": "#a6e22e", "base0C": "#a1efe4", "base0D": "#66d9ef", "base0E": "#ae81ff", "base0F": "#cc6633" };
                   export { monokai }; export default monokai;
        `
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'material-icons' }, async (x: {pluginData: string[]}) => {
      let icons: Record<string, string> = {};
      const imps = x.pluginData.map(icon => {
        const content = fs.readFileSync(`node_modules/@material-design-icons/svg/filled/${icon}.svg`, 'utf8');
        icons["icon_" + icon] = content;
      });
      return {
        contents:       `export default icons = ${JSON.stringify(icons)}`,
      }
    })
    build.onLoad({ filter: /.*/, namespace: 'windi' }, async (args: { path: string }) => {
      console.log(`Putting styles...`)
      const srcjs = jsfiles.map(x => {
        // console.log(`Scanning for classes in ${x}`)
        return fs.readFileSync(x, 'utf8')
      }).join('\n')
      const css = await generateStyles(srcjs)
      const f = `
      const windicss = ${JSON.stringify(css)};
      export default windicss;
      `
      return {
        contents: f,
      }
    })
    build.onResolve({ filter: /^react$/ }, (args: any) => {
      let f = path.resolve('node_modules/preact/dist/preact.min.js')
      return {
        path: f,
      }
    })
  },
}

const opts: Record<string, any> = {};
const watchFlag = process.argv.findIndex(x => x === '--watch') > 0;

if(watchFlag) {
  opts['watch'] = true;
}

let outputDir = 'dist';

const isDebug = 'watch' in opts;

const SHOW_REPORT = false; // show stats about asset size

(['esm', 'cjs']).map(fmt => {
  const outf = path.join(outputDir, 'index.' + (fmt == 'esm' ? 'mjs' : 'js'));
  console.log(`Building ${fmt} into ${outf}...`)
  require('esbuild').build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    minify: !isDebug,
    keepNames: isDebug,
    sourcemap: true,
    loader: {
      '.svg': 'text',
      '.css': 'text'
    },
    format: fmt,
    outfile: outf,
    plugins: [preactAlias],
    metafile: true,
    ...opts,
  }).catch(() => process.exit(1)).then((res: any) => {
    console.log("Built!")
    let esbuildMeta = require('esbuild').analyzeMetafile(res.metafile);
    esbuildMeta.then((report: any) => {
      if(SHOW_REPORT)
      console.log(report);
    })
    if("watch" in opts) {
      console.log("Continuing to watch...")
    }
  })
});