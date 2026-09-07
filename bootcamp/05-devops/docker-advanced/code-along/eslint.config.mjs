import { baseConfig } from '@bootcamp/eslint-config';

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs', 'index.js'],
        },
      },
    },
  },
];
