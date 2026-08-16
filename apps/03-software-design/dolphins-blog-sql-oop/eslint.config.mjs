import { baseConfig } from '@bootcamp/eslint-config';

export default [
  { ignores: ['**/dist/**', 'public/**'] },
  ...baseConfig,
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
