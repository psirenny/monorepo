// @flow

/* eslint-disable tree-shaking/no-side-effects-in-initialization */

declare module 'unified' {
  declare export default () => { use: any => void };
}
