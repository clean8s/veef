import { defineConfig } from 'vite'
// @ts-ignore
import preact from '@preact/preset-vite'
import windicss from "vite-plugin-windicss"
import autoimport from "./autoimport"
import iconLoader from "./icon-loader"
import plugin from 'windicss/plugin'
import { transform } from 'windicss/helpers'
import { Style } from "windicss/utils/style"

// https://vitejs.dev/config/

import daisyui from "daisyui"
export default defineConfig({
  plugins: [preact(), windicss({
    config: {
      plugins: [
        transform('daisyui'),
        plugin((utils) => {
          utils.addBase({
            ".peer-checked:checked ~ *": {
              "display": "block"
            }
          })
          utils.addVariant("peer-checked", (x) => {
            return x.pseudoClass("checked").child("~ *");
          })
        })
      ],
      extract: {
        include: [
          "src/**/*.{tsx,jsx,js}",
          "showcase/*.{tsx,jsx,js}"
        ],
        exclude: [
          ".git",
          "node_modules"
        ]
      }
    }
  }), autoimport, iconLoader],
  base: "./",
  build: {
    lib: {
      formats: ["es"],
      entry: "index.html"
    }
  }
})
