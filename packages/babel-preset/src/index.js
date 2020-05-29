// @flow strict

type Options = { [string]: mixed };

export default (_: mixed, opts: Options) => ({
  plugins: [
    ['@babel/plugin-transform-flow-strip-types'],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-do-expressions'],
    ['@babel/plugin-proposal-export-default-from'],
    ['@babel/plugin-proposal-export-namespace-from'],
    ['@babel/plugin-proposal-function-bind'],
    ['@babel/plugin-proposal-function-sent'],
    ['@babel/plugin-proposal-json-strings'],
    ['@babel/plugin-proposal-logical-assignment-operators'],
    ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }],
    ['@babel/plugin-proposal-numeric-separator'],
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    ['@babel/plugin-proposal-optional-catch-binding'],
    ['@babel/plugin-proposal-optional-chaining', { loose: true }],
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    ['@babel/plugin-proposal-throw-expressions'],
    ['@babel/plugin-proposal-unicode-property-regex', { useUnicodeFlag: true }],
    ['@babel/plugin-syntax-dynamic-import'],
    ['@babel/plugin-syntax-import-meta'],
    ['babel-plugin-preval'],
  ],
  presets: [
    // $FlowFixMe
    ['@babel/preset-env', { loose: true, shippedProposals: true, ...opts }],
  ],
});
