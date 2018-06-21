// @flow

import createVariants from './create-variants';
import formats from './formats_node';
import modes from './modes';
import targets from './targets_node';

export default createVariants({
  formats,
  modes,
  targets,
});
