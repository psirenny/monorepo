// @flow

export default {
  extends: [
    'eslint-config-airbnb-base',
    'plugin:flowtype/recommended',
    'plugin:ava/recommended',
  ],
  parser: 'babel-eslint',
  plugins: ['babel', 'flowtype', 'ava', 'markdown'],
  rules: {
    'arrow-parens': 0,
    'function-paren-newline': [0, 'consistent'],
    'max-len': [2, 160, 2, {
      ignorePattern: '^(ex|im)port (.*)',
      ignoreUrls: true,
      ignoreComments: false,
    }],
    'no-duplicate-imports': 0,
    'no-multiple-empty-lines': [2, { max: 1 }],
    'no-underscore-dangle': 0,
    'quote-props': [2, 'consistent-as-needed'],
  },
};
