// @flow

import createVariants from './create-variants';
import formats from './formats_node';
import modes from './modes';
import versions from './versions_node';

export default createVariants({
  formats,
  modes,
  versions,
});
