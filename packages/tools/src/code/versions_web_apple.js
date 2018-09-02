// @flow

import type { BuildVersion } from '../types/flow/BuildVersion';
import versionsWebAppleIos from './versions_web_apple_ios';
import versionsWebAppleMacos from './versions_web_apple_macos';

export default ([
  ...versionsWebAppleIos,
  ...versionsWebAppleMacos,
]: BuildVersion[]);
