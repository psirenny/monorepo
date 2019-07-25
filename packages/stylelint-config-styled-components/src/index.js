// @flow strict

export default {
  extends: [
    '@psirenny/stylelint-config',
    'stylelint-config-styled-components',
  ],
  processors: [
    'stylelint-processor-styled-components',
  ],
  rules: {
    'block-opening-brace-space-after': null,
    'declaration-bang-space-after': ['never'],
    'declaration-bang-space-before': ['always'],
    'no-empty-source': null,
    'no-missing-end-of-source-newline': null,
  },
};
