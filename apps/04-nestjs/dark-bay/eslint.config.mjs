import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

// Same ingredients as @bootcamp/eslint-config's baseConfig (js.configs.recommended,
// eslint-config-prettier, the shared no-unused-vars/no-console rules), but with
// tseslint.configs.recommendedTypeChecked instead of .recommended — this project
// leans on type-aware rules the plain preset doesn't have (no-floating-promises,
// no-unsafe-argument). Built directly rather than spreading baseConfig itself:
// layering two separately-resolved copies of typescript-eslint's `recommended`
// and `recommendedTypeChecked` presets in the same config trips ESLint's flat-config
// "Cannot redefine plugin" check, since each preset carries its own plugin instance.
export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        allowDefaultProject: ['eslint.config.mjs', 'prettier.config.mjs'],
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);
