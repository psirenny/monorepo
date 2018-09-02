// @flow

import type { BuildVariant } from '../types/flow/BuildVariant';
import variantsNode from './variants_node';
import variantsWeb from './variants_web';

export default ([
  ...variantsNode,
  ...variantsWeb,
]: BuildVariant[]);
