#!/usr/bin/env node

/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-extraneous-dependencies */

console.log(require.resolve('@babel/register'));

require('@babel/register')({
  babelrc: false,
  ignore: [modulePath => !modulePath.includes('monorepo/packages')],
});

require('./cli');
