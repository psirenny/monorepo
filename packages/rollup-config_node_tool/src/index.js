// @flow

import /* tree-shaking no-side-effects-when-called */ rollupPluginBabel from 'rollup-plugin-babel';
import /* tree-shaking no-side-effects-when-called */ rollupPluginFlowEntry from 'rollup-plugin-flow-entry';

export default {
  output: [
    { file: 'dist/cjs/index.js', format: 'cjs' },
    { file: 'dist/es/index.js', format: 'es' },
  ],
  plugins: [
    rollupPluginFlowEntry(),
    rollupPluginBabel(),
  ],
};
