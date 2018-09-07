#!/usr/bin/env node

// @flow

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import npmlog from 'npmlog';
import { join as pathJoin, resolve as pathResolve } from 'path';
import yargs from 'yargs';
import build from './build';
import buildGetVariantsByPlatformAliases from './get-variants-by-platform-aliases';
import buildPlatformAliases from './platform-aliases';

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
    .option('bootstrap', {
      default: false,
      description: 'Enable to self-build',
      type: 'boolean',
    })
    .option('platform-aliases', {
      array: true,
      choices: buildPlatformAliases,
      demandOption: true,
      description: 'Add platform alias',
    }),
  )
  .demandCommand(1)
  .help();

const [cmd] = yargs.argv._;

if (cmd === 'build') {
  const { cwd, platformAliases } = yargs.argv;

  // $FlowFixMe
  const pkg = require(`${cwd}/package.json`);

  const buildOpts = {
    bootstrap: yargs.argv.bootstrap,
    destDir: yargs.argv.destDir,
    logger: npmlog,
    pkgName: pkg.name,
    srcDir: yargs.argv.srcDir,
    variants: buildGetVariantsByPlatformAliases(platformAliases),
  };

  build(buildOpts, (err) => {
    if (err) throw err;
  });
}

export default yargs;
