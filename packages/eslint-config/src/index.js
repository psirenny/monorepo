// @flow

export default {
  extends: [
    'eslint-config-airbnb-base',
    'plugin:array-func/recommended',
    'plugin:ava/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:eslint-plugin/recommended',
    'plugin:flowtype/recommended',
  ],
  parser: 'babel-eslint',
  plugins: [
    'array-func',
    'ava',
    'babel',
    'eslint-comments',
    'eslint-plugin',
    'flowtype',
    'markdown',
    'optimize-regex',
  ],
  rules: {
    'arrow-parens': [0],
    'eslint-comments/disable-enable-pair': [2, { allowWholeFile: true }],
    'function-paren-newline': [0, 'consistent'],
    'max-len': [2, 160, 2, {
      ignoreComments: false,
      ignorePattern: '^(ex|im)port (.*)',
      ignoreUrls: true,
    }],
    'no-duplicate-imports': [0],
    'no-multiple-empty-lines': [2, { max: 1 }],
    'no-underscore-dangle': [0],
    'object-curly-newline': ['error', {
      ExportDeclaration: { consistent: true, minProperties: 5, multiline: true },
      ImportDeclaration: { consistent: true, minProperties: 5, multiline: true },
      ObjectExpression: { consistent: true, minProperties: 5, multiline: true },
      ObjectPattern: { consistent: true, minProperties: 5, multiline: true },
    }],
    'optimize-regex/optimize-regex': [2],
    'quote-props': [2, 'consistent-as-needed'],
    'sort-keys': [2, 'asc', { natural: true }],
    'sort-vars': [2],
  },
};
