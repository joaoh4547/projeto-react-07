import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'src/@types/'],
  },
  ...compat.extends('@rocketseat/eslint-config/react', 'next/core-web-vitals'),
  ...compat.config({
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  }),
]
