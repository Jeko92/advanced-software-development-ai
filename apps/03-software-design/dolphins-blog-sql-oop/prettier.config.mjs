import baseConfig from '@bootcamp/prettier-config' with { type: 'json' };

export default {
  ...baseConfig,
  plugins: [
    'prettier-plugin-jinja-template',
    'prettier-plugin-sql',
    'prettier-plugin-embed',
  ],
  overrides: [
    {
      files: ['*.njk'],
      options: {
        parser: 'jinja-template',
      },
    },
  ],
};
