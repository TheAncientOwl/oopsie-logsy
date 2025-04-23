import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js, prettier: prettierPlugin },
    extends: ['js/recommended', 'plugin:prettier/recommended'],
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]).concat(pluginReact.configs['jsx-runtime']);
