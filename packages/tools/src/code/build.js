// @flow

import asyncEach from 'async/each';
import asyncParallel from 'async/parallel';
import { minify as terserMinify } from 'terser';

import {
  copy as fsExtraCopy,
  ensureDir as fsExtraEnsureDir,
  remove as fsExtraRemove,
} from 'fs-extra';

import klaw from 'klaw';
import _camelCase from 'lodash/fp/camelCase';
import _mapKeys from 'lodash/fp/mapKeys';
import _upperFirst from 'lodash/fp/upperFirst';

import {
  basename as pathBasename,
  dirname as pathDirname,
  extname as pathExtname,
  join as pathJoin,
  sep as pathSep,
} from 'path';

import { rollup as rollupBundle } from 'rollup';
import rollupPluginBabel from 'rollup-plugin-babel';
import rollupPluginHashbang from 'rollup-plugin-hashbang';
import rollupPluginReplace from 'rollup-plugin-replace';
import rollupPluginString from 'rollup-plugin-string/dist/rollup-plugin-string';
import { uglify as rollupPluginUglify } from 'rollup-plugin-uglify';
import type { BuildVariant } from '../types/flow/BuildVariant';

type ConfigGetBabelOptions = (variant: BuildVariant, srcPath: string) => { [string]: any };
type ConfigGetNativeFileTypes = (variant: BuildVariant, srcPath: string) => string[];
type ConfigGetReplaceOptions = (variant: BuildVariant, srcPath: string) => { [string]: boolean };
type ConfigGetRollupExternal = (variant: BuildVariant, srcPath: string) => (modulePath: string) => boolean;
type ConfigGetRollupInputOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupOutputOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupPluginBabelOptions = (variant: BuildVariant, srcPath: string) => any[];
type ConfigGetRollupPluginHashbangOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupPluginReplaceOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupPluginStringOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupPluginTerserOptions = (variant: BuildVariant, srcPath: string) => ?any[];
type ConfigGetRollupPlugins = (variant: BuildVariant, srcPath: string) => ?any[];
type ConfigGetTerserOptions = (variant: BuildVariant, srcPath: string) => ?{ [string]: any };

type Config = {
  destDir?: string,
  getBabelOptions?: ConfigGetBabelOptions,
  getNativeFileTypes?: ConfigGetNativeFileTypes,
  getReplaceOptions?: ConfigGetReplaceOptions,
  getRollupExternal?: ConfigGetRollupExternal,
  getRollupInputOptions?: (variant: BuildVariant, srcPath: string) => any,
  getRollupOutputOptions?: (variant: BuildVariant, srcPath: string) => any,
  getRollupPluginBabelOptions?: ConfigGetRollupPluginBabelOptions,
  getRollupPluginHashbangOptions?: ConfigGetRollupPluginHashbangOptions,
  getRollupPluginReplaceOptions?: ConfigGetRollupPluginReplaceOptions,
  getRollupPluginStringOptions?: ConfigGetRollupPluginStringOptions,
  getRollupPluginTerserOptions?: ConfigGetRollupPluginTerserOptions,
  getRollupPlugins?: ConfigGetRollupPlugins,
  getTerserOptions?: ConfigGetTerserOptions,
  pkgName: string,
  srcDir: string,
  terserCache?: {},
  variants: BuildVariant[],
};

type ConfigWithDefaults = {
  destDir: string,
  getBabelOptions: ConfigGetBabelOptions,
  getNativeFileTypes: ConfigGetNativeFileTypes,
  getReplaceOptions: ConfigGetReplaceOptions,
  getRollupExternal: ConfigGetRollupExternal,
  getRollupInputOptions: ConfigGetRollupInputOptions,
  getRollupOutputOptions: ConfigGetRollupOutputOptions,
  getRollupPluginBabelOptions: ConfigGetRollupPluginBabelOptions,
  getRollupPluginHashbangOptions: ConfigGetRollupPluginHashbangOptions,
  getRollupPluginReplaceOptions: ConfigGetRollupPluginReplaceOptions,
  getRollupPluginStringOptions: ConfigGetRollupPluginStringOptions,
  getRollupPluginTerserOptions: ConfigGetRollupPluginTerserOptions,
  getRollupPlugins: ConfigGetRollupPlugins,
  getTerserOptions: ConfigGetTerserOptions,
  pkgName: string,
  srcDir: string,
  terserCache: {},
  variants: BuildVariant[],
};

type Callback = (err?: ?Error) => void;

const pascalCase = x => _upperFirst(_camelCase(x));

const defaultGetBabelOptions = (variant: BuildVariant) => {
  const opts = {
    plugins: [],
    presets: [
      ['@babel/env', {
        loose: true,
        modules: false,
        targets: variant.targets,
      }],
      ['@babel/flow'],
      ['@babel/stage-0', {
        decoratorsLegacy: true,
        loose: true,
      }],
    ],
  };

  if (variant.mode === 'debug') {
    opts.presets.push(['power-assert']);
  } else {
    opts.plugins.push(['unassert']);
  }

  return opts;
};

const defaultGetReplaceOptions = (variant: BuildVariant) => ({
  DEBUG: variant.mode === 'debug',
});

const defaultGetNativeFileTypes = () => [
  'java',
  'swift',
];

const defaultCreateGetTerserOptions = (terserCache: { [string]: string }) => (
  (variant: BuildVariant) => (
    variant.mode === 'debug' ? null : {
      compress: {
        drop_console: true,
        keep_fargs: false,
        passes: 2,
        pure_getters: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      mangle: {
        toplevel: true,
      },
      nameCache: terserCache,
    }
  )
);

const defaultCreateGetRollupExternal = (getNativeFileTypes: ConfigGetNativeFileTypes) => (
  (variant: BuildVariant, srcPath: string) => (
    (modulePath: string) => {
      if (modulePath === srcPath) return false;
      if (modulePath.startsWith('\0')) return false;

      const nativeFileTypes = getNativeFileTypes(variant, srcPath);

      for (let i = 0; i < nativeFileTypes.length; i += 1) {
        if (modulePath.endsWith(`.${nativeFileTypes[i]}`)) {
          return false;
        }
      }

      return true;
    }
  )
);

const defaultCreateGetRollupPluginBabelOptions = (getBabelOptions: ConfigGetBabelOptions) => (
  (variant: BuildVariant, srcPath: string) => [{
    ...getBabelOptions(variant, srcPath),
    externalHelpers: true,
    runtimeHelpers: true,
  }]
);

const defaultCreateGetRollupPluginHashbangOptions = () => (
  (variant: BuildVariant, srcPath: string) => {
    const srcPathSegs = srcPath.split(pathSep);
    const srcIsCli = srcPathSegs.includes('cli.js') || srcPathSegs.includes('cli');
    return srcIsCli ? [] : false;
  }
);

const defaultCreateGetRollupPluginReplaceOptions = (getReplaceOptions: ConfigGetReplaceOptions) => (
  (variant: BuildVariant, srcPath: string) => {
    const vals = getReplaceOptions(variant, srcPath);
    const opts = { values: _mapKeys(key => `global.${key}`, vals) };
    return [opts];
  }
);

const defaultCreateGetRollupPluginStringOptions = (getNativeFileTypes: ConfigGetNativeFileTypes) => (
  (variant: BuildVariant, srcPath: string) => [{
    include: getNativeFileTypes(variant, srcPath).map(type => `**/*.${type}`),
  }]
);

const defaultCreateGetRollupPluginTerserOptions = (getTerserOptions: ConfigGetTerserOptions) => (
  (variant: BuildVariant, srcPath: string) => {
    const terserOpts = getTerserOptions(variant, srcPath);
    return terserOpts ? [terserOpts, terserMinify] : null;
  }
);

const defaultCreateGetRollupPlugins = (
  getRollupPluginBabelOptions: ConfigGetRollupPluginBabelOptions,
  getRollupPluginHashbangOptions: ConfigGetRollupPluginHashbangOptions,
  getRollupPluginReplaceOptions: ConfigGetRollupPluginReplaceOptions,
  getRollupPluginStringOptions: ConfigGetRollupPluginStringOptions,
  getRollupPluginTerserOptions: ConfigGetRollupPluginTerserOptions,
) => (
  (variant: BuildVariant, srcPath: string) => {
    const plugins = [];
    const pluginBabelOpts = getRollupPluginBabelOptions(variant, srcPath);
    const pluginHashbangOpts = getRollupPluginHashbangOptions(variant, srcPath);
    const pluginReplaceOpts = getRollupPluginReplaceOptions(variant, srcPath);
    const pluginStringOpts = getRollupPluginStringOptions(variant, srcPath);
    const pluginTerserOpts = getRollupPluginTerserOptions(variant, srcPath);

    if (pluginStringOpts) {
      plugins.push(rollupPluginString.apply(
        rollupPluginString,
        pluginStringOpts,
      ));
    }

    if (pluginReplaceOpts) {
      plugins.push(rollupPluginReplace.apply(
        rollupPluginReplace,
        pluginReplaceOpts,
      ));
    }

    if (pluginBabelOpts) {
      const [opts, ...restOpts] = pluginBabelOpts;
      const mergedOpts = [{ ...opts, babelrc: false }, ...restOpts];

      plugins.push(rollupPluginBabel.apply(
        ...pluginBabelOpts,
        mergedOpts,
      ));
    }

    if (pluginHashbangOpts) {
      plugins.push(rollupPluginHashbang.apply(
        rollupPluginHashbang,
      ));
    }

    if (pluginTerserOpts) {
      plugins.push(rollupPluginUglify.apply(
        rollupPluginUglify,
        pluginTerserOpts,
      ));
    }

    return plugins;
  }
);

const defaultCreateGetRollupInputOptions = (
  getRollupExternal: ConfigGetRollupExternal,
  getRollupPlugins: ConfigGetRollupPlugins,
) => (
  (variant: BuildVariant, srcPath: string) => ({
    external: getRollupExternal(variant, srcPath),
    plugins: getRollupPlugins(variant, srcPath),
  })
);

const defaultCreateGetRollupOutputOptions = (pkgName: string) => (
  (variant: BuildVariant, srcPath: string) => ({
    freeze: false,
    interop: false,
    name: pathBasename(srcPath) === 'index.js'
      ? pascalCase(`${pkgName}`)
      : pascalCase(`${pkgName}/${pathBasename(srcPath, '.js')}`),
    sourcemap: true,
    treeshake: {
      propertyReadSideEffects: false,
      pureExternalModules: true,
    },
  })
);

const mergeDefaultConfig = (cfg: Config): ConfigWithDefaults => {
  const destDir = cfg.destDir || pathJoin(cfg.srcDir, '../dist');
  const terserCache = cfg.terserCache || {};
  const getTerserOptions = cfg.getTerserOptions || defaultCreateGetTerserOptions(terserCache);
  const getBabelOptions = cfg.getBabelOptions || defaultGetBabelOptions;
  const getNativeFileTypes = cfg.getNativeFileTypes || defaultGetNativeFileTypes;
  const getReplaceOptions = cfg.getReplaceOptions || defaultGetReplaceOptions;
  const getRollupExternal = cfg.getRollupExternal || defaultCreateGetRollupExternal(getNativeFileTypes);
  const getRollupPluginBabelOptions = cfg.getRollupPluginBabelOptions || defaultCreateGetRollupPluginBabelOptions(getBabelOptions);
  const getRollupPluginTerserOptions = cfg.getRollupPluginTerserOptions || defaultCreateGetRollupPluginTerserOptions(getTerserOptions);
  const getRollupPluginHashbangOptions = cfg.getRollupPluginHashbangOptions || defaultCreateGetRollupPluginHashbangOptions();
  const getRollupPluginReplaceOptions = cfg.getRollupPluginReplaceOptions || defaultCreateGetRollupPluginReplaceOptions(getReplaceOptions);
  const getRollupPluginStringOptions = cfg.getRollupPluginStringOptions || defaultCreateGetRollupPluginStringOptions(getNativeFileTypes);
  const getRollupOutputOptions = cfg.getRollupOutputOptions || defaultCreateGetRollupOutputOptions(cfg.pkgName);

  const getRollupPlugins = cfg.getRollupPlugins || defaultCreateGetRollupPlugins(
    getRollupPluginBabelOptions,
    getRollupPluginHashbangOptions,
    getRollupPluginReplaceOptions,
    getRollupPluginStringOptions,
    getRollupPluginTerserOptions,
  );

  const getRollupInputOptions = cfg.getRollupInputOptions || defaultCreateGetRollupInputOptions(
    getRollupExternal,
    getRollupPlugins,
  );

  return {
    destDir,
    getBabelOptions,
    getNativeFileTypes,
    getReplaceOptions,
    getRollupExternal,
    getRollupInputOptions,
    getRollupOutputOptions,
    getRollupPluginBabelOptions,
    getRollupPluginHashbangOptions,
    getRollupPluginReplaceOptions,
    getRollupPluginStringOptions,
    getRollupPluginTerserOptions,
    getRollupPlugins,
    getTerserOptions,
    ...cfg,
  };
};

const buildSrc = (config: Config) => {
  const cfg = mergeDefaultConfig({
    terserCache: {},
    ...config,
  });

  return (srcPath: string, cb: Callback) => {
    const relPath = srcPath.replace(cfg.srcDir, '');
    const destDir = cfg.destDir || pathJoin(cfg.srcDir, '../dist');

    asyncEach(cfg.variants, (variant, done0) => {
      const destPath = pathJoin(destDir, variant.subpath, relPath);

      fsExtraEnsureDir(pathDirname(destPath), (ensureDirErr) => {
        if (ensureDirErr) return done0(ensureDirErr);

        switch (pathExtname(srcPath)) {
          case '':
            return null;
          case '.js':
            return asyncParallel([
              (done1) => fsExtraCopy(srcPath, `${destPath}.flow`, done1),
              (done1) => {
                const rollupInputOpts = {
                  ...cfg.getRollupInputOptions(variant, srcPath),
                  input: srcPath,
                };

                const rollupOutputOpts = {
                  ...cfg.getRollupOutputOptions(variant, srcPath),
                  file: destPath,
                  format: variant.format,
                };

                rollupBundle(rollupInputOpts)
                  .catch(err => done1(err))
                  .then(bundle => {
                    if (bundle.exports.length) {
                      bundle.write(rollupOutputOpts)
                        .catch(err => done1(err))
                        .then(() => done1());
                    }
                  });
              },
            ], done0);
          default:
            return fsExtraCopy(
              srcPath,
              destPath,
              done0,
            );
        }
      });
    }, cb);
  };
};

const build = (cfg: Config, cb: Callback) => {
  const srcPaths = [];
  const buildSrcPath = buildSrc(cfg);
  const distDir = pathJoin(cfg.srcDir, '../dist');

  fsExtraRemove(distDir, (cleanErr) => {
    if (cleanErr) return cb(cleanErr);

    return klaw(cfg.srcDir)
      .on('data', (fd) => srcPaths.push(fd.path))
      .on('end', () => asyncEach(srcPaths, buildSrcPath, cb));
  });
};

export default build;
