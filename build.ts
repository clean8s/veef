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
  
  return styles
}

import { sync as globSync } from 'glob'


let preactAlias = {
  name: 'preact-alias',
  setup(build: any) {
    let path = require('path')
    
    let jsfiles = globSync('**/*.tsx', {
      dot: false,
      nodir: true,
      ignore: ['.git/*', 'node_modules/**/*'],
    })
    
    build.onResolve({ filter: /^virtual:windi$/ }, (args: { importer: any }) => {
      return {
        path: args.importer,
        namespace: 'windi',
      }
    })
    build.onLoad({ filter: /.*/, namespace: 'windi' }, async (args: { path: string }) => {
      console.log(`Putting styles...`)
      const srcjs = jsfiles.map(x => {
        console.log(`Scanning for classes in ${x}`)
        return fs.readFileSync(x, 'utf8')
      }).join('\n')
      const css = await generateStyles(srcjs)
      const f = 'export default ' + JSON.stringify(css)
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

const out = process.argv.findIndex(x => x === '--out');
const htmlTransform =  (html: string) => {
  const nonce = Math.random().toString(36).substr(2, 7);
  return html
  .replace("<!--script-->", `<script src="https://unpkg.com/veef?${nonce}"></script>`)
  .replace(`<script src="dist/index.mjs"></script>`, "")
}

if(out > 0) {
  const maybeOut = process.argv[out + 1];
  if(maybeOut) {
    outputDir = maybeOut;
    const htmlCopy = fs.readFileSync('index.html', 'utf8');
    fs.writeFileSync(path.join(outputDir, 'index.html'), htmlTransform(htmlCopy));
  }
}
const isDebug = 'watch' in opts;

(['esm', 'cjs']).map(fmt => {
  const outf = path.join(outputDir, 'index.' + (fmt == 'esm' ? 'mjs' : 'js'));
  console.log(`Building ${fmt} into ${outf}...`)
  require('esbuild').build({
    entryPoints: ['index.tsx'],
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
    ...opts,
  }).catch(() => process.exit(1)).then(() => {
    console.log("Built!")
    if("watch" in opts) {
      console.log("Continuing to watch...")
    }
  })
});