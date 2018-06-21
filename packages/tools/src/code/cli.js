#!/usr/bin/env node

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

// @flow

import { join as pathJoin, resolve as pathResolve } from 'path';
import yargs from 'yargs';
import build from './build';
import buildPlatforms from './platforms';
import getBuildVariantsFromPlatforms from './get-variants-from-platforms';

yargs
  .option('cwd', {
    default: process.cwd(),
    defaultDescription: './',
    description: 'Set current working directory',
    string: true,
  })
  .command('build', 'Build commands', y => y
    .option('srcDir', {
      coerce: x => pathResolve(y.parsed.argv.cwd, x),
      default: pathJoin(yargs.argv.cwd, 'src'),
      defaultDescription: 'src',
      description: 'Set source directory',
      type: 'string',
    })
    .option('destDir', {
      coerce: x => pathResolve(y.parsed.argv.cwd, x),
      default: pathJoin(yargs.argv.cwd, 'dist'),
      defaultDescription: 'dist',
      description: 'Set destination directory',
      type: 'string',
    })
    .option('platforms', {
      array: true,
      choices: buildPlatforms,
      demandOption: true,
      description: 'Add build platform',
    }),
  )
  .demandCommand(1)
  .help();

const [cmd] = yargs.argv._;

if (cmd === 'build') {
  const { cwd, platforms } = yargs.argv;

  // $FlowFixMe
  const pkg = require(`${cwd}/package.json`);

  const buildOpts = {
    destDir: yargs.argv.destDir,
    pkgName: pkg.name,
    srcDir: yargs.argv.srcDir,
    variants: getBuildVariantsFromPlatforms(platforms),
  };

  build(buildOpts, (err) => {
    if (err) throw err;
  });
}

export default yargs;
