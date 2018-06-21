// @flow

import variants from './variants';
import variantsWeb from './variants_web';
import variantsWebApple from './variants_web_apple';
import variantsWebAppleIos from './variants_web_apple_ios';
import variantsWebAppleMacos from './variants_web_apple_macos';
import variantsNode from './variants_node';
import type { BuildVariantsByPlatform } from '../types/flow/BuildVariantsByPlatform';

export default ({
  all: variants,
  web: variantsWeb,
  webApple: variantsWebApple,
  webAppleIos: variantsWebAppleIos,
  webAppleMacos: variantsWebAppleMacos,
  node: variantsNode,
}: BuildVariantsByPlatform);
