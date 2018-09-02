// @flow

import '@babel/polyfill';
import type { BuildFormat } from '../types/flow/BuildFormat';
import type { BuildMode } from '../types/flow/BuildMode';
import type { BuildVersion } from '../types/flow/BuildVersion';
import type { BuildVariant } from '../types/flow/BuildVariant';
import createVariant from './create-variant';

type Options = {
  formats: BuildFormat[],
  modes: BuildMode[],
  versions: BuildVersion[],
};

export default (opts: Options): BuildVariant[] => {
  const variants = [];

  opts.versions.forEach(version => (
    opts.formats.forEach(format => (
      opts.modes.forEach(mode => (
        variants.push(createVariant({
          format, mode, version,
        }))
      ))
    ))
  ));

  return variants;
};
