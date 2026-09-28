import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';
import { baseConfig } from '@bootcamp/eslint-config';

export default defineConfig([
  globalIgnores(['dist', 'src/components/ui']),
  { ignores: ['eslint.config.js', 'prettier.config.mjs'] },
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintPluginPrettierRecommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
