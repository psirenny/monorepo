// @flow strict

import rollupPluginBabel from 'rollup-plugin-babel';
import rollupPluginFlowEntry from 'rollup-plugin-flow-entry';

export default {
  external: [
    '@psirenny/dictionary',
    'dictionary-en-us',
    'retext-assuming',
    'retext-contractions',
    'retext-diacritics',
    'retext-english',
    'retext-equality',
    'retext-indefinite-article',
    'retext-intensify',
    'retext-passive',
    'retext-profanities',
    'retext-quotes',
    'retext-readability',
    'retext-redundant-acronyms',
    'retext-repeated-words',
    'retext-sentence-spacing',
    'retext-simplify',
    'retext-spell',
    'retext-syntax-mentions',
    'retext-syntax-urls',
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
