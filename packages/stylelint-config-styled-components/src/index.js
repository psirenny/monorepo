// @flow strict

export default {
  extends: ['stylelint-config-styled-components'],
  processors: [['stylelint-processor-styled-components', {
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
      'nullishCoalescingOperator',
    ],
  }]],
  rules: {
    'block-opening-brace-space-after': null,
    'no-empty-source': null,
    'no-missing-end-of-source-newline': null,
    'value-keyword-case': ['lower', {
      ignoreKeywords: ['dummyValue'],
    }],
  },
};
