// @flow

import type { BabelEnvTargets } from './BabelEnvTargets';
import type { BuildFormat } from './BuildFormat';
import type { BuildMode } from './BuildMode';
import type { BuildPlatform } from './BuildPlatform';

export type BuildVariant = {|
  format: BuildFormat,
  mode: BuildMode,
  platform: BuildPlatform,
  subpath: string,
  targets: BabelEnvTargets,
  version: string,
|};
