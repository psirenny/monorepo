// @flow

import type { BabelEnvTargets } from './BabelEnvTargets';
import type { BuildPlatform } from './BuildPlatform';

export type BuildTarget = {
  platform: BuildPlatform,
  targets: BabelEnvTargets,
  version: string,
};
