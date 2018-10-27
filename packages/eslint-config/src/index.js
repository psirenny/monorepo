// @flow

export default {
  extends: [
    'plugin:eslint-plugin/recommended',
    'eslint-config-airbnb-base',
    'plugin:flowtype/recommended',
    'plugin:ava/recommended',
  ],
  parser: 'babel-eslint',
  plugins: [
    'ava',
    'eslint-plugin',
    'babel',
    'flowtype',
    'markdown',
    'optimize-regex',
  ],
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
    'object-curly-newline': ['error', {
      ObjectExpression: { consistent: true, minProperties: 5, multiline: true },
      ObjectPattern: { consistent: true, minProperties: 5, multiline: true },
      ImportDeclaration: { consistent: true, minProperties: 5, multiline: true },
      ExportDeclaration: { consistent: true, minProperties: 5, multiline: true },
    }],
    'optimize-regex/optimize-regex': 2,
    'quote-props': [2, 'consistent-as-needed'],
    'sort-imports': 2,
  },
};
