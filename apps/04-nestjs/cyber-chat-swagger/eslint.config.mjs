import { baseConfig } from '@bootcamp/eslint-config';

export default [
  // client/ is a checked-in, auto-generated OpenAPI SDK (openapi-generator
  // output) — not part of this app's own tsconfig project, and not meant
  // to be hand-edited or linted like the rest of the source.
  { ignores: ['**/dist/**', 'client/**'] },
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
