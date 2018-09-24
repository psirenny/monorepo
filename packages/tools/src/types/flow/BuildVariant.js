// @flow

import type { BuildFormat } from './BuildFormat';
import type { BuildMode } from './BuildMode';
import type { BuildVersion } from './BuildVersion';

export type BuildVariant = {|
  format: BuildFormat,
  mode: BuildMode,
  version: BuildVersion,
|};
