// @flow

import browserslist from 'browserslist';
import targetQueries from './versions_apple_ios';
import type { BuildTarget } from '../types/flow/BuildTarget';

const targets = browserslist(targetQueries);

export default (
  targets.map(target => ({
    platform: 'ios',
    targets: { browsers: target },
    version: target.replace('ios_saf ', ''),
  })): BuildTarget[]
);
