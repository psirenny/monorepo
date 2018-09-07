// @flow

import browserslist from 'browserslist';
import type { BuildPlatform } from '../types/flow/BuildPlatform';
import type { BuildQuery } from '../types/flow/BuildQuery';
import type { BuildVersion } from '../types/flow/BuildVersion';

export default (platform: BuildPlatform, queries: BuildQuery, useSemver: boolean): BuildVersion[] => {
  const versions: BuildVersion[] = [];
  const allTargets = new Set();

  Object.keys(queries).forEach((tag) => {
    const query = queries[tag];
    const targets = browserslist(query);

    if (!tag.startsWith('_')) {
      versions.push({
        isSemver: false,
        isTag: true,
        name: tag,
        platform,
        targets,
      });
    }

    targets.forEach((target) => {
      allTargets.add(target);
    });
  });

  allTargets.forEach(target => {
    const semverPatch = target.split(' ')[1];

    versions.push({
      isSemver: true,
      isTag: false,
      name: semverPatch,
      platform,
      targets: target,
    });
  });

  return versions;
};
