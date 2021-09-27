import { defineConfig } from 'vite'
// @ts-ignore
import preact from '@preact/preset-vite'
import windicss from "vite-plugin-windicss"
import autoimport from "./autoimport"
import iconLoader from "./icon-loader"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), windicss(), autoimport, iconLoader],
  build: {
    lib: {
      formats: ["es"],
      entry: "showcase.tsx"
    }
  }
})
