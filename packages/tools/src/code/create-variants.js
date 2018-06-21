// @flow

import '@babel/polyfill';
import type { BuildFormat } from '../types/flow/BuildFormat';
import type { BuildMode } from '../types/flow/BuildMode';
import type { BuildTarget } from '../types/flow/BuildTarget';
import type { BuildVariant } from '../types/flow/BuildVariant';
import createVariant from './create-variant';

type Options = {
  formats: BuildFormat[],
  modes: BuildMode[],
  targets: BuildTarget[],
};

export default (opts: Options): BuildVariant[] => {
  const variants = [];

  opts.targets.forEach(target => (
    opts.formats.forEach(format => (
      opts.modes.forEach(mode => (
        variants.push(createVariant({
          format, mode, target,
        }))
      ))
    ))
  ));

  return variants;
};
