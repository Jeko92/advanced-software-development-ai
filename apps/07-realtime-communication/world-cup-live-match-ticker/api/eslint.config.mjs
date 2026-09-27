import globals from 'globals';
import { baseConfig } from '@bootcamp/eslint-config';

export default [
  { ignores: ['dist/**'] },
  ...baseConfig,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs', 'prettier.config.mjs'],
        },
      },
    },
  },
];
