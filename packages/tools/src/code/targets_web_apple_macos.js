// @flow

import browserslist from 'browserslist';
import targetQueries from './versions_apple_macos';
import type { BuildTarget } from '../types/flow/BuildTarget';

const targets = browserslist(targetQueries);

export default (
  targets.map(target => ({
    platform: 'macos',
    targets: { browsers: target },
    version: target.replace('safari ', ''),
  })): BuildTarget[]
);
