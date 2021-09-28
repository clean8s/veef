import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: [
      'index.html',
      'src/**/*.{vue,html,jsx,tsx}',
      'showcase/*.tsx'
    ],
    exclude: [
      'node_modules/**/*',
      '.git/**/*',
    ],
  },
})