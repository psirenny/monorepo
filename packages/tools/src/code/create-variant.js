// @flow

import type { BuildFormat } from '../types/flow/BuildFormat';
import type { BuildMode } from '../types/flow/BuildMode';
import type { BuildVersion } from '../types/flow/BuildVersion';
import type { BuildVariant } from '../types/flow/BuildVariant';

type Options = {
  format: BuildFormat,
  mode: BuildMode,
  version: BuildVersion,
};

export default (opts: Options): BuildVariant => ({
  format: opts.format,
  mode: opts.mode,
  version: opts.version,
});
