// @flow

import variants from './variants';
import variantsNode from './variants_node';
import variantsWeb from './variants_web';
import variantsWebApple from './variants_web_apple';
import variantsWebAppleIos from './variants_web_apple_ios';
import variantsWebAppleMacos from './variants_web_apple_macos';
import type { BuildVariantsByPlatformAlias } from '../types/flow/BuildVariantsByPlatformAlias';

export default ({
  all: variants,
  node: variantsNode,
  web: variantsWeb,
  webApple: variantsWebApple,
  webAppleIos: variantsWebAppleIos,
  webAppleMacos: variantsWebAppleMacos,
}: BuildVariantsByPlatformAlias);
