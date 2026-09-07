import { baseConfig } from '@bootcamp/eslint-config';

export default [
  { ignores: ['**/dist/**', 'client/**'] },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint.config.mjs',
            'prettier.config.mjs',
            'vitest.config.ts',
            'vitest.config.e2e.ts',
          ],
        },
      },
    },
  },
];
