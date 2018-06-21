// @flow

import type { BuildPlatform } from '../types/flow/BuildPlatform';
import type { BuildVariant } from '../types/flow/BuildVariant';
import variantsByPlatform from './variants-by-platform';

export default (platforms: BuildPlatform[]): BuildVariant[] => {
  let variants = [];

  platforms.forEach((platform) => {
    variants = [...variantsByPlatform[platform]];
  });

  return variants;
};
