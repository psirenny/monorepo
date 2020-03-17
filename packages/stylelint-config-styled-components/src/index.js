// @flow strict

export default {
  extends: ['stylelint-config-styled-components'],
  processors: ['stylelint-processor-styled-components'],
  rules: {
    'block-opening-brace-space-after': null,
    'no-empty-source': null,
    'no-missing-end-of-source-newline': null,
    'value-keyword-case': ['lower', {
      ignoreKeywords: ['dummyValue'],
    }],
  },
};
