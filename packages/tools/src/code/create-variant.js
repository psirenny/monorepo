// @flow

import type { BuildFormat } from '../types/flow/BuildFormat';
import type { BuildMode } from '../types/flow/BuildMode';
import type { BuildTarget } from '../types/flow/BuildTarget';
import type { BuildVariant } from '../types/flow/BuildVariant';

type Options = {
  format: BuildFormat,
  mode: BuildMode,
  target: BuildTarget,
};

export default (opts: Options): BuildVariant => ({
  format: opts.format,
  mode: opts.mode,
  platform: opts.target.platform,
  subpath: `${opts.target.platform}/${opts.target.version}/${opts.format}/${opts.mode}`,
  targets: opts.target.targets,
  version: opts.target.version,
});
