import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import { baseConfig } from '@bootcamp/eslint-config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = [
  { ignores: ['**/.next/**'] },
  ...baseConfig,
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs', 'prettier.config.mjs'],
        },
      },
    },
  },
];

export default eslintConfig;
