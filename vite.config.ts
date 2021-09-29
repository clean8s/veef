import { defineConfig } from 'vite'
// @ts-ignore
import preact from '@preact/preset-vite'
import windicss from "vite-plugin-windicss"
import autoimport from "./autoimport"
import iconLoader from "./icon-loader"
import plugin from 'windicss/plugin'
import { Style } from "windicss/utils/style"

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
          // utils.addVariant('peer-checked', (x) => {
          //   x.pseudoClass("checked")
          //   return utils.addBase({
          //     "": {
          //       background: "red"
          //     }
          //   })[0];
          //   return x.modifySelectors(({className}) => {
          //     return "bg-red-500";
          //   });

          //   return utils.addUtilities({
          //     "input:checked": {
          //       "background": "red"
          //     }
          //   })[0];
          //   return x.style;
          // })
          // utils.addBase({
          //   "input:checked ~ .peer-checked": {
          //     "display": "block"
          //   }
          // })
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
