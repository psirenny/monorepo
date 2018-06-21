// @flow

import type { BuildPlatform } from './BuildPlatform';
import type { BuildVariant } from './BuildVariant';

export type BuildVariantsByPlatform = {
  [BuildPlatform]: BuildVariant[],
};
