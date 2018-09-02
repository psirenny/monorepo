// @flow

import type { BuildPlatformAlias } from '../types/flow/BuildPlatformAlias';
import type { BuildVariant } from '../types/flow/BuildVariant';
import variantsByPlatformAlias from './variants-by-platform-alias';

export default (platformAliases: BuildPlatformAlias[]): BuildVariant[] => {
  let variants = [];

  platformAliases.forEach((platformAlias) => {
    variants = [...variantsByPlatformAlias[platformAlias]];
  });

  return variants;
};
