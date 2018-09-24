// @flow

import asyncEach from 'async/each';
import asyncEachLimit from 'async/eachLimit';
import asyncParallel from 'async/parallel';
import { minify as terserMinify } from 'terser';
import { copy as fsExtraCopy, ensureDir as fsExtraEnsureDir, remove as fsExtraRemove } from 'fs-extra';
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
import rollupPluginAlias from 'rollup-plugin-alias';
import rollupPluginBabel from 'rollup-plugin-babel';
import rollupPluginCommonjs from 'rollup-plugin-commonjs';
import rollupPluginHashbang from 'rollup-plugin-hashbang';
import rollupPluginJson from 'rollup-plugin-json';
import rollupPluginNodeResolve from 'rollup-plugin-node-resolve';
import rollupPluginReplace from 'rollup-plugin-replace';
import rollupPluginString from 'rollup-plugin-string/dist/rollup-plugin-string';
import { terser as rollupPluginTerser } from 'rollup-plugin-terser';
import babelPreset from '../../../babel-preset/src';
import type { BuildVariant } from '../types/flow/BuildVariant';

type ConfigGetBabelOptions = (variant: BuildVariant, srcPath: string) => { [string]: any };
type ConfigGetNativeFileTypes = (variant: BuildVariant, srcPath: string) => string[];
type ConfigGetReplaceOptions = (variant: BuildVariant, srcPath: string) => { [string]: boolean };
type ConfigGetRollupExternal = (variant: BuildVariant, srcPath: string) => (modulePath: string) => boolean;
type ConfigGetRollupInputOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupOutputOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupPluginBabelOptions = (variant: BuildVariant, srcPath: string) => any[];
type ConfigGetRollupPluginCommonjsOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupPluginHashbangOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupPluginJsonOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupPluginNodeResolveOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupPluginReplaceOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupPluginStringOptions = (variant: BuildVariant, srcPath: string) => any;
type ConfigGetRollupPluginTerserOptions = (variant: BuildVariant, srcPath: string) => ?any[];
type ConfigGetRollupPlugins = (variant: BuildVariant, srcPath: string) => ?any[];
type ConfigGetTerserOptions = (variant: BuildVariant, srcPath: string) => ?{ [string]: any };

type Config = {
  bootstrap?: boolean,
  destDir?: string,
  getBabelOptions?: ConfigGetBabelOptions,
  getNativeFileTypes?: ConfigGetNativeFileTypes,
  getReplaceOptions?: ConfigGetReplaceOptions,
  getRollupExternal?: ConfigGetRollupExternal,
  getRollupInputOptions?: (variant: BuildVariant, srcPath: string) => any,
  getRollupOutputOptions?: (variant: BuildVariant, srcPath: string) => any,
  getRollupPluginBabelOptions?: ConfigGetRollupPluginBabelOptions,
  getRollupPluginCommonjsOptions?: ConfigGetRollupPluginCommonjsOptions,
  getRollupPluginHashbangOptions?: ConfigGetRollupPluginHashbangOptions,
  getRollupPluginJsonOptions?: ConfigGetRollupPluginJsonOptions,
  getRollupPluginNodeResolveOptions?: ConfigGetRollupPluginNodeResolveOptions,
  getRollupPluginReplaceOptions?: ConfigGetRollupPluginReplaceOptions,
  getRollupPluginStringOptions?: ConfigGetRollupPluginStringOptions,
  getRollupPluginTerserOptions?: ConfigGetRollupPluginTerserOptions,
  getRollupPlugins?: ConfigGetRollupPlugins,
  getTerserOptions?: ConfigGetTerserOptions,
  logger: any,
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
  getRollupPluginCommonjsOptions: ConfigGetRollupPluginJsonOptions,
  getRollupPluginHashbangOptions: ConfigGetRollupPluginHashbangOptions,
  getRollupPluginJsonOptions: ConfigGetRollupPluginJsonOptions,
  getRollupPluginNodeResolveOptions: ConfigGetRollupPluginNodeResolveOptions,
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
      [babelPreset, {
        modules: false,
        targets: variant.version.targets,
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

const defaultCreateGetRollupExternal = (cfg: Config, getNativeFileTypes: ConfigGetNativeFileTypes) => (
  (variant: BuildVariant, srcPath: string) => (
    (modulePath: string) => {
      if (cfg.bootstrap) {
        if (modulePath.includes('@psirenny/dictionary')) return false;
        if (modulePath.includes('monorepo/packages/dictionary')) return false;
        if (modulePath.includes('/babel-preset')) return false;
        if (modulePath.includes('/browserslist-config')) return false;
        if (modulePath.includes('/eslint-config')) return false;
        if (modulePath.includes('/remark-preset')) return false;
        if (modulePath.includes('/retext-preset')) return false;
      }

      if (modulePath === srcPath) {
        return false;
      }

      if (modulePath.startsWith('\0')) {
        return false;
      }

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

const defaultCreateGetRollupPluginCommonjsOptions = () => () => null;

const defaultCreateGetRollupPluginHashbangOptions = () => (
  (variant: BuildVariant, srcPath: string) => {
    const srcPathSegs = srcPath.split(pathSep);
    const srcIsCli = srcPathSegs.includes('cli.babel.js') || srcPathSegs.includes('cli.js') || srcPathSegs.includes('cli');
    return srcIsCli ? [] : false;
  }
);

const defaultCreateGetRollupPluginJsonOptions = () => () => ({});

const defaultCreateGetRollupPluginNodeResolveOptions = () => () => ({});

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
  cfg: Config,
  getRollupPluginBabelOptions: ConfigGetRollupPluginBabelOptions,
  getRollupPluginCommonjsOptions: ConfigGetRollupPluginCommonjsOptions,
  getRollupPluginHashbangOptions: ConfigGetRollupPluginHashbangOptions,
  getRollupPluginJsonOptions: ConfigGetRollupPluginJsonOptions,
  getRollupPluginNodeResolveOptions: ConfigGetRollupPluginNodeResolveOptions,
  getRollupPluginReplaceOptions: ConfigGetRollupPluginReplaceOptions,
  getRollupPluginStringOptions: ConfigGetRollupPluginStringOptions,
  getRollupPluginTerserOptions: ConfigGetRollupPluginTerserOptions,
) => (
  (variant: BuildVariant, srcPath: string) => {
    const plugins = [];
    const pluginBabelOpts = getRollupPluginBabelOptions(variant, srcPath);
    const pluginCommonjsOpts = getRollupPluginCommonjsOptions(variant, srcPath);
    const pluginHashbangOpts = getRollupPluginHashbangOptions(variant, srcPath);
    const pluginJsonOpts = getRollupPluginJsonOptions(variant, srcPath);
    const pluginNodeResolveOpts = getRollupPluginNodeResolveOptions(variant, srcPath);
    const pluginReplaceOpts = getRollupPluginReplaceOptions(variant, srcPath);
    const pluginStringOpts = getRollupPluginStringOptions(variant, srcPath);
    const pluginTerserOpts = getRollupPluginTerserOptions(variant, srcPath);

    if (cfg.bootstrap) {
      plugins.push(rollupPluginAlias({
        '@psirenny/dictionary': pathJoin(__dirname, '../../../dictionary/src/index.js'),
        '@psirenny/retext-preset': pathJoin(__dirname, '../../../retext-preset/src/index.js'),
      }));
    }

    if (pluginJsonOpts) {
      plugins.push(rollupPluginJson.apply(
        rollupPluginJson,
        pluginJsonOpts,
      ));
    }

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

    if (cfg.bootstrap) {
      plugins.push(rollupPluginCommonjs({
        include: /babel-preset/,
      }));
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
        pluginCommonjsOpts,
      ));
    }

    if (pluginNodeResolveOpts) {
      plugins.push(rollupPluginNodeResolve.apply(
        rollupPluginNodeResolve,
        pluginNodeResolveOpts,
      ));
    }

    if (pluginCommonjsOpts) {
      plugins.push(rollupPluginCommonjs.apply(
        rollupPluginCommonjs,
        pluginCommonjsOpts,
      ));
    }

    if (pluginTerserOpts) {
      plugins.push(rollupPluginTerser.apply(
        rollupPluginTerser,
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
  const getRollupExternal = cfg.getRollupExternal || defaultCreateGetRollupExternal(cfg, getNativeFileTypes);
  const getRollupPluginBabelOptions = cfg.getRollupPluginBabelOptions || defaultCreateGetRollupPluginBabelOptions(getBabelOptions);
  const getRollupPluginCommonjsOptions = cfg.getRollupPluginCommonjsOptions || defaultCreateGetRollupPluginCommonjsOptions();
  const getRollupPluginHashbangOptions = cfg.getRollupPluginHashbangOptions || defaultCreateGetRollupPluginHashbangOptions();
  const getRollupPluginJsonOptions = cfg.getRollupPluginJsonOptions || defaultCreateGetRollupPluginJsonOptions();
  const getRollupPluginNodeResolveOptions = cfg.getRollupPluginNodeResolveOptions || defaultCreateGetRollupPluginNodeResolveOptions();
  const getRollupPluginReplaceOptions = cfg.getRollupPluginReplaceOptions || defaultCreateGetRollupPluginReplaceOptions(getReplaceOptions);
  const getRollupPluginStringOptions = cfg.getRollupPluginStringOptions || defaultCreateGetRollupPluginStringOptions(getNativeFileTypes);
  const getRollupPluginTerserOptions = cfg.getRollupPluginTerserOptions || defaultCreateGetRollupPluginTerserOptions(getTerserOptions);
  const getRollupOutputOptions = cfg.getRollupOutputOptions || defaultCreateGetRollupOutputOptions(cfg.pkgName);

  const getRollupPlugins = cfg.getRollupPlugins || defaultCreateGetRollupPlugins(
    cfg,
    getRollupPluginBabelOptions,
    getRollupPluginCommonjsOptions,
    getRollupPluginHashbangOptions,
    getRollupPluginJsonOptions,
    getRollupPluginNodeResolveOptions,
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
    getRollupPluginCommonjsOptions,
    getRollupPluginHashbangOptions,
    getRollupPluginJsonOptions,
    getRollupPluginNodeResolveOptions,
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

    cfg.logger.log('info', (new Date()).toISOString(), `Found source file: “${srcPath}”`);

    asyncEachLimit(cfg.variants, 2, (variant, done0) => {
      const origDestPath = pathJoin(
        destDir,
        variant.version.platform,
        variant.version.isTag ? 'tag' : 'v',
        variant.version.name,
        variant.format,
        variant.mode,
        relPath,
      );

      const semverVersions = !variant.version.isSemver ? [] : [
        variant.version.name.split('.').slice(0, 2).join('.'),
        variant.version.name.split('.').slice(0, 1).join('.'),
      ];

      const semverDestPaths = semverVersions.map(
        semverVersion => pathJoin(
          destDir,
          variant.version.platform,
          variant.version.isTag ? 'tag' : 'v',
          semverVersion,
          variant.format,
          variant.mode,
          relPath,
        ),
      );

      const destPaths = [
        origDestPath,
        ...semverDestPaths,
      ];

      asyncEach(
        destPaths,
        (destPath, done1) => {
          cfg.logger.log('info', (new Date()).toISOString(), `Create dest directory: ${pathDirname(destPath)}`);
          fsExtraEnsureDir(pathDirname(destPath), done1);
        },
        (ensureDirsErr) => {
          if (ensureDirsErr) return done0(ensureDirsErr);

          switch (pathExtname(srcPath)) {
            case '':
              cfg.logger.log('info', (new Date()).toISOString(), `Skip source file: “${srcPath}”`);
              return null;
            case '.js':
              return asyncParallel([
                (done1) => {
                  const destPath = `${origDestPath}.flow`;
                  cfg.logger.log('info', (new Date()).toISOString(), `Create flow typedef file: ${destPath}`);
                  fsExtraCopy(srcPath, destPath, done1);
                },
                (done1) => {
                  const rollupInputOpts = {
                    ...cfg.getRollupInputOptions(variant, srcPath),
                    input: srcPath,
                  };

                  const rollupOutputOpts = {
                    ...cfg.getRollupOutputOptions(variant, srcPath),
                    file: origDestPath,
                    format: variant.format,
                  };

                  rollupBundle(rollupInputOpts)
                    .catch(err => done1(err))
                    .then(bundle => {
                      if (!bundle?.exports.length) return done1();

                      cfg.logger.log('info', (new Date()).toISOString(), `Build source file: ${origDestPath}`);

                      return bundle.write(rollupOutputOpts)
                        .catch(err => done1(err))
                        .then(() => asyncEach(
                          semverDestPaths,
                          (semverDestPath, done2) => {
                            cfg.logger.log('info', (new Date()).toISOString(), `Copy patch version: “${semverDestPath}”`);
                            fsExtraCopy(origDestPath, semverDestPath, done2);
                          },
                          done1,
                        ));
                    });
                },
              ], done0);
            default:
              return asyncEach(
                destPaths,
                (destPath, done1) => {
                  cfg.logger.log('info', (new Date()).toISOString(), `Copy source file: “${destPath}”`);
                  fsExtraCopy(srcPath, destPath, done1);
                },
                done0,
              );
          }
        },
      );
    }, cb);
  };
};

const build = (cfg: Config, cb: Callback) => {
  const srcPaths = [];
  const buildSrcPath = buildSrc(cfg);
  const distDir = pathJoin(cfg.srcDir, '../dist');

  cfg.logger.log('info', (new Date()).toISOString(), `Remove previous dist “${distDir}“`);

  fsExtraRemove(distDir, (cleanErr) => {
    if (cleanErr) return cb(cleanErr);

    cfg.logger.log('info', (new Date()).toISOString(), 'Search source files');

    return klaw(cfg.srcDir)
      .on('data', (fd) => srcPaths.push(fd.path))
      .on('end', () => asyncEach(srcPaths, buildSrcPath, cb));
  });
};

export default build;
