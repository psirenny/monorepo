// @flow

import type { BabelEnvTargets } from './BabelEnvTargets';
import type { BuildPlatform } from './BuildPlatform';

export type BuildVersion = {|
  isSemver: boolean,
  isTag: boolean,
  name: string,
  platform: BuildPlatform,
  targets: BabelEnvTargets,
|};
