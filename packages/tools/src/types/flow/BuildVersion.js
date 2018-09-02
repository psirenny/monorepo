// @flow

import type { BabelEnvTargets } from './BabelEnvTargets';
import type { BuildPlatform } from './BuildPlatform';

export type BuildVersion = {|
  isTag: boolean,
  name: string,
  platform: BuildPlatform,
  targets: BabelEnvTargets,
|};
