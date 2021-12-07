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

    build.onLoad({ filter: /.*/, namespace: 'material-icons' }, async (x: {pluginData: string[]}) => {
      let icons: Record<string, string> = {};
      const imps = x.pluginData.map(icon => {
        const content = fs.readFileSync(`node_modules/@material-design-icons/svg/filled/${icon}.svg`, 'utf8');
        icons["icon_" + icon] = content;
        // return `export icon_${icon} = ${JSON.stringify(content)};`
      });
      return {
        contents:       `export default icons = ${JSON.stringify(icons)}`,
      }
    })
    build.onLoad({ filter: /.*/, namespace: 'windi' }, async (args: { path: string }) => {
      console.log(`Putting styles...`)
      const srcjs = jsfiles.map(x => {
        console.log(`Scanning for classes in ${x}`)
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

(['esm', 'cjs']).map(fmt => {
  const outf = path.join(outputDir, 'index.' + (fmt == 'esm' ? 'mjs' : 'js'));
  console.log(`Building ${fmt} into ${outf}...`)
  if(fmt === 'cjs') {
    opts.banner = {
        js: '(function(exports){'
      };
    opts.footer = {
      js: '})({});'
    }
  }
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
    ...opts,
  }).catch(() => process.exit(1)).then(() => {
    console.log("Built!")
    if("watch" in opts) {
      console.log("Continuing to watch...")
    }
  })
});