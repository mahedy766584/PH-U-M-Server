// eslint.config.mjs
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**'],
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      eqeqeq: 'off',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-unused-expressions': 'error',
      'no-console': 'warn',
      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
      'no-var': 'error',
    },
    extends: [js.configs.recommended, tseslint.configs.recommended, prettier],
  },
])
