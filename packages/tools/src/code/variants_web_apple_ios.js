// @flow

import createVariants from './create-variants';
import formats from './formats_web';
import modes from './modes';
import versions from './versions_web_apple_ios';

export default createVariants({
  formats,
  modes,
  versions,
});
