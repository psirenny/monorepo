// @flow

import type { BuildVariant } from '../types/flow/BuildVariant';
import variantsWeb from './variants_web';
import variantsNode from './variants_node';

export default ([
  ...variantsWeb,
  ...variantsNode,
]: BuildVariant[]);
