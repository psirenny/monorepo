// @flow

import type { BuildVariant } from './BuildVariant';

export type BuildVariantsByPlatformAlias = {|
  all: BuildVariant[],
  node: BuildVariant[],
  web: BuildVariant[],
  webApple: BuildVariant[],
  webAppleIos: BuildVariant[],
  webAppleMacos: BuildVariant[],
|};
