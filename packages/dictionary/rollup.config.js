// @flow strict

import rollupPluginBabel from 'rollup-plugin-babel';
import rollupPluginFlowEntry from 'rollup-plugin-flow-entry';

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/cjs/index.js', format: 'cjs' },
    { file: 'dist/es/index.js', format: 'es' },
  ],
  plugins: [
    rollupPluginFlowEntry(),
    rollupPluginBabel({ babelHelpers: 'inline' }),
  ],
};
