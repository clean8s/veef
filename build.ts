import { Processor } from 'windicss/lib'
const fs = require('fs')
const path = require('path')
import { createUtils, UserOptions } from '@windicss/plugin-utils'

export function generateWindi(classes: string, wantedSelector: string) {
  const P = new Processor({});
  const cstm = P.compile(classes, "");

  const fullResp = cstm.styleSheet.build(false);
  return fullResp.replaceAll(`.${cstm.className}`, wantedSelector)
}

async function generateStyles(html: string, preflight?: boolean, asSheet?: boolean) {
  let K = createUtils()
  await K.ensureInit()
  let out = await K.applyExtractors(html)
  
  // Get windi processor
  const processor = new Processor({

  })
  
  const htmlClasses = (out.classes as string[]).join(' ')
  
  // Generate preflight based on the html we input
  const preflightSheet = processor.preflight(html)
  
  // Process the html classes to an interpreted style sheet
  const interpretedSheet = processor.interpret(htmlClasses).styleSheet
  if(asSheet === true) {
    return interpretedSheet;
  }
  
  // Build styles
  const APPEND = false
  const MINIFY = false
  let sheet = interpretedSheet;
  if(preflight !== false) {
    sheet = sheet.extend(preflightSheet, APPEND);
  }
  const styles = sheet.build(MINIFY)
  
  //@ts-ignore
  return minifyCss(styles);
}

const minifyCss = (someCss: string) : string => {
  return (new (require("clean-css"))({})).minify(someCss).styles;
}

import { sync as globSync } from 'glob'
import { readFileSync, writeFileSync } from 'fs'
import { StyleSheet } from 'windicss/types/utils/style'

type ResolveArgs = {importer: string, path: string};

let preactAlias = {
  name: 'preact-alias',
  setup(build: any) {
    let path = require('path')

    
    let jsfiles = globSync('**/*.tsx', {
      dot: false,
      nodir: true,
      ignore: ['.git/*', 'node_modules/**/*'],
    })

    build.onResolve({ filter: /^virtual:windi$/ }, (args: ResolveArgs) => {
      return {
        path: args.importer,
        namespace: 'windi',
      }
    })

    build.onResolve({ filter: /^base16/ }, (args: ResolveArgs) => {
      return {
        path: path.resolve("node_modules/base16/lib/monokai.js")
      }
    });

    build.onLoad({filter: /vendor\.css/}, async (x: any) => {
      const M = readFileSync(x.path, 'utf8');
      const txt2 = await generateStyles(M, false, true) as StyleSheet;


      let newCss = '';
      M.replaceAll(/\/\*\s*@windi\s*(.*?)\s*\*\/\s*(.*?) {/gms, (...groups: string[]) => {
        const windiCls = groups[1];
        const wantedSel = groups[2];
        wantedSel.split(",").map(x => {
          newCss += generateWindi(windiCls, x);
        });
        return groups[0];
      });
      return { contents: minifyCss(readFileSync(x.path, 'utf8')) + newCss, loader: 'text' }
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

import {spawn, spawnSync} from "child_process"
let attempt = 0;
function buildDemo(retry: boolean) {
  let args: [string, object] = ["node build.js" + (retry ? " --watch" : ""), {cwd: "demos", shell: true, stdio: "inherit", }];
  if(!retry) {
    spawnSync(...args)
  } else {
    spawn(...args).on("close", () => {
      let interval = 1000 * Math.pow(1.4, attempt + 1);
      setTimeout(() => {
        buildDemo(true);
        attempt++;
        attempt = attempt % 5;
      }, interval);
    });
  }
}


if(watchFlag) {
  opts['watch'] = true;
  buildDemo(true)
} else {
  buildDemo(false)
}

let outputDir = 'dist';

const isDebug = 'watch' in opts;

const SHOW_REPORT = false; // show stats about asset size

([/*'esm',*/ 'iife']).map(fmt => {
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