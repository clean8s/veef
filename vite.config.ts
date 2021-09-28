import { defineConfig } from 'vite'
// @ts-ignore
import preact from '@preact/preset-vite'
import windicss from "vite-plugin-windicss"
import autoimport from "./autoimport"
import iconLoader from "./icon-loader"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), windicss({
    config: {
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
