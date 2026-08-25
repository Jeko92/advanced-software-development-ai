import baseConfig from '@bootcamp/prettier-config' with { type: 'json' };

export default {
  ...baseConfig,
  plugins: ['prettier-plugin-jinja-template'],
  overrides: [
    {
      files: ['*.njk'],
      options: {
        parser: 'jinja-template',
      },
    },
  ],
};
