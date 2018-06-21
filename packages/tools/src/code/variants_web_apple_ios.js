// @flow

import createVariants from './create-variants';
import formats from './formats_web';
import modes from './modes';
import targets from './targets_web_apple_ios';

export default createVariants({
  formats,
  modes,
  targets,
});
