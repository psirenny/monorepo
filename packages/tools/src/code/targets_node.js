// @flow

import type { BuildTarget } from '../types/flow/BuildTarget';
import targets from './versions_node';

export default (
  targets.map(target => ({
    platform: 'node',
    targets: { node: target.replace('node ', '') },
    version: target.replace('node ', ''),
  })): BuildTarget[]
);
