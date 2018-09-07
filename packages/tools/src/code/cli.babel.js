#!/usr/bin/env node

/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');

const pkgsDir = path.join(__dirname, '../../..');

require('@babel/register')({
  babelrc: false,
  ignore: [modulePath => !modulePath.includes(pkgsDir)],
});

require('./cli');
