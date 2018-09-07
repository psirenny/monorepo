// @flow

import type { BabelEnvTargets } from './BabelEnvTargets';
import type { BuildFormat } from './BuildFormat';
import type { BuildMode } from './BuildMode';
import type { BuildPlatform } from './BuildPlatform';
import type { BuildVersion } from './BuildVersion';

export type BuildVariant = {|
  format: BuildFormat,
  mode: BuildMode,
  version: BuildVersion,
|};
