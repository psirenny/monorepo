// @flow strict

import rollupPluginBabel from 'rollup-plugin-babel';
import rollupPluginFlowEntry from 'rollup-plugin-flow-entry';

export default {
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
