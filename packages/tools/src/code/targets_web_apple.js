// @flow

import type { BuildTarget } from '../types/flow/BuildTarget';
import targetsWebAppleIos from './targets_web_apple_ios';
import targetsWebAppleMacos from './targets_web_apple_macos';

export default ([
  ...targetsWebAppleIos,
  ...targetsWebAppleMacos,
]: BuildTarget[]);
