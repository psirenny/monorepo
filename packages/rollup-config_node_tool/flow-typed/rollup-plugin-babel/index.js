// @flow

/* eslint-disable tree-shaking/no-side-effects-in-initialization */

declare module 'rollup-plugin-babel' {
  declare export default () => () => void;
}
