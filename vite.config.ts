import { defineConfig } from 'vite'
// @ts-ignore
import preact from '@preact/preset-vite'
import windicss from "vite-plugin-windicss"
import autoimport from "./autoimport"
import iconLoader from "./icon-loader"
import cssProcess from "./css-process"
import plugin from 'windicss/plugin'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [preact(), windicss({
    config: {
      plugins: [
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
  }), autoimport, iconLoader, cssProcess],
  base: "./",
  build: {
    lib: {
      formats: ["es"],
      entry: "index.html"
    }
  }
})
