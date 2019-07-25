// @flow strict

export default {
  extends: [
    '@psirenny/stylelint-config',
    'stylelint-config-styled-components',
  ],
  processors: [
    ['stylelint-processor-styled-components', {
      parserPlugins: [
        'jsx',
        'objectRestSpread',
        ['decorators', { decoratorsBeforeExport: true }],
        'classProperties',
        'exportExtensions',
        'asyncGenerators',
        'functionBind',
        'functionSent',
        'dynamicImport',
        'optionalCatchBinding',
        'optionalChaining',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'nullishCoalescingOperator',
        'numericSeparator',
        'throwExpressions',
      ],
    }],
  ],
  rules: {
    'block-opening-brace-space-after': null,
    'declaration-bang-space-after': ['never'],
    'declaration-bang-space-before': ['always'],
    'no-empty-source': null,
    'no-missing-end-of-source-newline': null,
  },
};
