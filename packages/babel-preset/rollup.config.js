// @flow

import rollupPluginFlow from 'rollup-plugin-flow';
import rollupPluginFlowEntry from 'rollup-plugin-flow-entry';

export default {
  input: 'src/index.js',
  output: { file: 'dist/index.js', format: 'cjs' },
  plugins: [
    rollupPluginFlowEntry({ mode: 'strict' }),
    rollupPluginFlow(),
  ],
};
