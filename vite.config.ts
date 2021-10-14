import { defineConfig } from 'vite'
// @ts-ignore
import preact from '@preact/preset-vite'
import windicss from "vite-plugin-windicss"
import iconLoader from "./icon-loader"
import htmlFormat from "./html-output-formatter"
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
  }), iconLoader, htmlFormat],
  base: "./",
  build: {
    lib: {
      formats: ["es"],
      entry: "index.html"
    }
  }
})
