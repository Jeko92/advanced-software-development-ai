import { baseConfig } from '@bootcamp/eslint-config';

export default [
  { ignores: ['**/dist/**', '**/.db/**'] },
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
