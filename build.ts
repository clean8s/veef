import { Processor } from 'windicss/lib'
const fs = require('fs')
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
if(process.argv.length > 1) {
  opts['watch'] = process.argv[2] === 'watch';
}

require('esbuild').build({
  // watch: true,
  entryPoints: ['index.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  loader: {
    '.svg': 'text',
    '.css': 'text'
  },
  format: 'esm',
  outfile: 'dist/index.mjs',
  plugins: [preactAlias],
  ...opts,
}).catch(() => process.exit(1)).then(() => {
  
  const distjs = fs.readFileSync('dist/index.mjs', 'utf8')
  const indexh = fs.readFileSync('index.html', 'utf8')
  
  if(process.argv.length > 1 && process.argv[2] === 'git') {

    /* 
        For git builds we want a non .gitignore'd version of dist/
        so that GitHub Pages can commit it. 

        Also we want a CDN provided source instead of the local one.
    */
    const nonce = Math.random().toString(36).substring(2, 15);
    // create directory recursively if it doesn't exist
    fs.mkdirSync('git-dist', { recursive: true }, () => void 0); 

    fs.writeFileSync('git-dist/index.mjs', distjs)
    fs.writeFileSync('git-dist/index.html', indexh
    .replace("<!--script-->", `<script src="https://unpkg.com/veef?${nonce}"></script>`)
    .replace(`<script src="dist/index.mjs"></script>`, "")
    );
  }
})