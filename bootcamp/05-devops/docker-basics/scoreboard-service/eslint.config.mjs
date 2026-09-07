import { baseConfig } from '@bootcamp/eslint-config';

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        setInterval: 'readonly',
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs', 'index.js'],
        },
      },
    },
  },
];
