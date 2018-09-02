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
  platform: opts.version.platform,
  subpath: `${opts.version.platform}/${opts.version.isTag ? 'tag' : 'v'}/${opts.version.name}/${opts.format}/${opts.mode}`,
  targets: opts.version.targets,
  version: opts.version.name,
});
