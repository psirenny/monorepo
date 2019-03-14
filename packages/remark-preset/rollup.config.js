// @flow strict

import rollupPluginBabel from 'rollup-plugin-babel';
import rollupPluginFlowEntry from 'rollup-plugin-flow-entry';

export default {
  external: [
    '@psirenny/retext-preset',
    'remark-lint-blockquote-indentation',
    'remark-lint-checkbox-character-style',
    'remark-lint-code-block-style',
    'remark-lint-emphasis-marker',
    'remark-lint-fenced-code-marker',
    'remark-lint-heading-style',
    'remark-lint-link-title-style',
    'remark-lint-rule-style',
    'remark-lint-strong-marker',
    'remark-lint-table-cell-padding',
    'remark-preset-lint-markdown-style-guide',
    'remark-preset-lint-recommended',
    'remark-retext',
    'unified',
  ],
  input: 'src/index.js',
  output: [
    { file: 'dist/cjs/index.js', format: 'cjs' },
    { file: 'dist/esm/index.js', format: 'esm' },
  ],
  plugins: [
    rollupPluginFlowEntry({ mode: 'strict' }),
    rollupPluginBabel({ babelHelpers: 'inline' }),
  ],
};
