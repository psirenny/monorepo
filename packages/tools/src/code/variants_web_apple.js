// @flow

import type { BuildVariant } from '../types/flow/BuildVariant';
import variantsWebAppleIos from './variants_web_apple_ios';
import variantsWebAppleMacos from './variants_web_apple_macos';

export default ([
  ...variantsWebAppleIos,
  ...variantsWebAppleMacos,
]: BuildVariant[]);
