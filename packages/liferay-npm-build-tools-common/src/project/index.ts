/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import childProcess from 'child_process';
import prop from 'dot-prop';
import fs from 'fs';
import path from 'path';
import readJsonSync from 'read-json-sync';
import resolveModule from 'resolve';
import webpack from 'webpack';

import FilePath from '../file-path';
import {info, print, warn} from '../format';
import {splitModuleName} from '../modules';
import Jar from './jar';
import Localization from './localization';
import Misc from './misc';
import Probe from './probe';
import Rules from './rules';
import {VersionInfo} from './types';

/** A package manager */
export type PkgManager = 'npm' | 'yarn' | null;

/** Exports configuration */
export interface Exports {
	[id: string]: string;
}

/** Imports configuration */
export interface Imports {
	[pkgName: string]: ImportsConfig;
}

export interface ImportsConfig {
	provider: string;
	version: string;
}

/** Minimal package.json structure description */
export interface PkgJson {
	name: string;
	version: string;
	description?: string;
	main?: string;
	portlet?: {
		[property: string]: string | boolean;
	};
	dependencies?: {
		[pkgName: string]: string;
	};
	devDependencies?: {
		[pkgName: string]: string;
	};
	peerDependencies?: {
		[pkgName: string]: string;
	};
}

/** The webpack config provider function signature */
export interface WebpackConfigProvider {
	(webpackConfig: webpack.Configuration): webpack.Configuration;
}

/**
 * Describes a standard JS Toolkit project.
 */
export class Project {
	jar: Jar;
	l10n: Localization;
	misc: Misc;
	probe: Probe;
	rules: Rules;

	/**
	 * @param projectDirPath project's path in native format
	 */
	constructor(projectDirPath: string) {
		this.loadFrom(projectDirPath);
	}

	/**
	 * Get module paths	to export to the outside world making them available
	 * through the AMD loader.
	 *
	 * @remarks
	 * Note that the usual CommonJS syntax is used to differentiate local
	 * modules from dependency (node_modules) modules.
	 *
	 * For example:
	 *
	 * - Local module: './src/my-api'
	 * - Dependency module: 'lodash/trimEnd'
	 */
	get exports(): Exports {
		if (this._exports === undefined) {
			this._exports = prop.get(this._configuration, 'exports', {});

			// Export package.json's main entry (if present) automatically
			if (!this._exports['main']) {
				let main = this._pkgJson.main;

				if (main) {
					if (main.startsWith('/')) {
						main = `.${main}`;
					} else if (!main.startsWith('.')) {
						main = `./${main}`;
					}

					this._exports['main'] = main;
				} else if (fs.existsSync('./index.js')) {
					this._exports['main'] = './index.js';
				}
			}
		}

		return this._exports;
	}

	get imports(): Imports {
		if (this._imports === undefined) {
			this._imports = {};

			const imports = prop.get(this._configuration, 'imports', {});

			Object.entries(imports).forEach(
				([provider, config]: [string, string]) => {
					Object.entries(config).forEach(
						([pkgName, version]: [string, string]) => {
							if (pkgName === '/') {
								pkgName = provider;
							}

							this._imports[pkgName] = {
								provider,
								version,
							};
						}
					);
				},
				{} as Imports
			);
		}

		return this._imports;
	}

	/**
	 * Get user's webpack configuration provider function.
	 */
	get webpackConfigProvider(): WebpackConfigProvider {
		if (this._webpack === undefined) {
			const webpack = prop.get(this._configuration, 'webpack', {});

			if (typeof webpack === 'function') {
				this._webpack = webpack as WebpackConfigProvider;
			} else {
				// TODO: maybe smart merge this ?
				this._webpack = (
					webpackConfiguration
				): webpack.Configuration => ({
					...webpackConfiguration,
					...webpack,
				});
			}
		}

		return this._webpack;
	}

	/**
	 * Get directories inside the project containing source files starting with
	 * `./` (so that they can be safely path.joined)
	 */
	get sources(): FilePath[] {
		if (this._sources === undefined) {
			this._sources = prop
				.get(this._configuration, 'sources', [])
				.map(source =>
					source.startsWith('./') ? source : `./${source}`
				)
				.map(source => new FilePath(source, {posix: true}));
		}

		return this._sources;
	}

	/**
	 * Get directory where files to be transformed live relative to
	 * `this.dir` and starting with `./` (so that it can be safely path.joined)
	 */
	get buildDir(): FilePath {
		if (this._buildDir === undefined) {
			let dir = prop.get(this._configuration, 'output', './build');

			if (!dir.startsWith('./')) {
				dir = `./${dir}`;
			}

			this._buildDir = new FilePath(dir, {posix: true});
		}

		return this._buildDir;
	}

	/**
	 * Get absolute path to project's directory.
	 */
	get dir(): FilePath {
		return this._projectDir;
	}

	/**
	 * Get global plugins configuration.
	 */
	get globalConfig(): object {
		const {_configuration} = this;

		return prop.get(_configuration, 'config', {});
	}

	// TODO: rename to `configuration`
	/**
	 * Get project's parsed .npmbundlerrc file
	 */
	get npmbundlerrc(): object {
		return this._configuration;
	}

	/**
	 * Get project's parsed package.json file
	 */
	get pkgJson(): PkgJson {
		return this._pkgJson;
	}

	/**
	 * Return the package manager that the project is using or null if it cannot
	 * be inferred.
	 */
	get pkgManager(): PkgManager {
		if (this._pkgManager === undefined) {
			let yarnLockPresent = fs.existsSync(
				this._projectDir.join('yarn.lock').asNative
			);
			let pkgLockPresent = fs.existsSync(
				this._projectDir.join('package-lock.json').asNative
			);

			// If both present act as if none was present
			if (yarnLockPresent && pkgLockPresent) {
				yarnLockPresent = pkgLockPresent = false;
			}

			if (yarnLockPresent) {
				this._pkgManager = 'yarn';
			} else if (pkgLockPresent) {
				this._pkgManager = 'npm';
			} else {
				// If no file is found autodetect command availability
				let yarnPresent =
					childProcess.spawnSync('yarn', ['--version'], {
						shell: true,
					}).error === undefined;
				let npmPresent =
					childProcess.spawnSync('npm', ['--version'], {
						shell: true,
					}).error === undefined;

				// If both present act as if none was present
				if (yarnPresent && npmPresent) {
					yarnPresent = npmPresent = false;
				}

				if (yarnPresent) {
					this._pkgManager = 'yarn';
				} else if (npmPresent) {
					this._pkgManager = 'npm';
				}
			}

			// If nothing detected store null
			if (this._pkgManager === undefined) {
				this._pkgManager = null;
			}
		}

		return this._pkgManager;
	}

	/**
	 * Get all available information about versions of plugins and presets used
	 * for the build.
	 * @return a Map where keys are package names
	 */
	get versionsInfo(): Map<string, VersionInfo> {
		if (this._versionsInfo === undefined) {
			let map = new Map<string, VersionInfo>();

			const putInMap = (packageName): void => {
				const pkgJsonPath = this.toolResolve(
					`${packageName}/package.json`
				);
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const pkgJson = require(pkgJsonPath);

				map.set(pkgJson.name, {
					version: pkgJson.version,
					path: path.relative(
						this.dir.asNative,
						path.dirname(pkgJsonPath)
					),
				});
			};

			// Get bundler and me versions
			putInMap('liferay-npm-bundler');
			putInMap(path.join(__dirname, '../..'));

			// Get preset version
			const {_configuration} = this;
			const preset = _configuration['preset'];

			if (preset) {
				putInMap(splitModuleName(preset).pkgName);
			}

			map = new Map([...map, ...this.rules.versionsInfo]);

			this._versionsInfo = map;
		}

		return this._versionsInfo;
	}

	/**
	 * Reload the whole project from given directory. Especially useful for
	 * tests.
	 * @param projectPath
	 * project's path in native format (whether absolute or relative to cwd)
	 * @param configFilePath
	 * optional path to configuration file (relative to `projectPath` if not
	 * given as an absolute path)
	 */
	loadFrom(
		projectPath: string,
		configFilePath = 'liferay-npm-bundler.config.js'
	): void {
		// First reset everything
		this._buildDir = undefined;
		this._configFile = undefined;
		this._configuration = undefined;
		this._pkgJson = undefined;
		this._pkgManager = undefined;
		this._projectDir = undefined;
		this._sources = undefined;
		this._toolsDir = undefined;

		// Set significant directories
		this._projectDir = new FilePath(path.resolve(projectPath));
		this._configFile = new FilePath(
			path.isAbsolute(configFilePath)
				? configFilePath
				: path.resolve(path.join(projectPath, configFilePath))
		);
		this._toolsDir = this._projectDir;

		// Load configuration files
		this._loadPkgJson();
		this._loadConfiguration();

		// Initialize subdomains
		this.jar = new Jar(this);
		this.l10n = new Localization(this);
		this.misc = new Misc(this);
		this.probe = new Probe(this);
		this.rules = new Rules(this);
	}

	/**
	 * Requires a module in the context of the project (as opposed to the
	 * context of the calling package which would just use a normal `require()`
	 * call).
	 * @param moduleName
	 */
	require(moduleName: string): unknown {
		return require(this.resolve(moduleName));
	}

	/**
	 * Resolves a module in the context of the project (as opposed to the
	 * context of the calling package which would just use a normal
	 * `require.resolve()` call).
	 * @param moduleName
	 */
	resolve(moduleName: string): string {
		return resolveModule.sync(moduleName, {
			basedir: this.dir.asNative,
		});
	}

	/**
	 * Set program arguments so that some of them can be parsed as if they were
	 * `.npmbundlerrc` options.
	 */
	set argv(argv: {
		config: string;
		'create-jar': boolean;
		'dump-report': boolean;
	}) {
		const {_configuration} = this;

		if (argv.config) {
			this.loadFrom('.', argv.config);
		}

		if (argv['create-jar']) {
			_configuration['create-jar'] = true;
		}

		if (argv['dump-report']) {
			_configuration['dump-report'] = true;
		}
	}

	/**
	 * Requires a tool module in the context of the project (as opposed to the
	 * context of the calling package which would just use a normal `require()`
	 * call).
	 *
	 * @remarks
	 * This looks in the `.npmbundlerrc` preset before calling the standard
	 * {@link require} method.
	 *
	 * @param moduleName
	 * @throws if module is not found
	 */
	toolRequire(moduleName: string): unknown {
		return require(this.toolResolve(moduleName));
	}

	// TODO: this is not needed any more as presets have been removed
	/**
	 * Resolves a tool module in the context of the project (as opposed to the
	 * context of the calling package which would just use a normal
	 * `require.resolve()` call).
	 *
	 * @remarks
	 * This looks in the `.npmbundlerrc` preset before calling the standard
	 * {@link require} method.x
	 *
	 * @param moduleName
	 * @throws if module is not found
	 */
	toolResolve(moduleName: string): string {
		try {
			return resolveModule.sync(moduleName, {
				basedir: this._toolsDir.asNative,
			});
		} catch (err) {
			return this.resolve(moduleName);
		}
	}

	_loadConfiguration(): void {
		const {_configFile} = this;
		const configDir = _configFile.dirname();

		if (fs.existsSync(configDir.join('.npmbundlerrc').asNative)) {
			print(
				warn`There is a {.npmbundlerrc} file in {${configDir.basename()}}: it will be ignored`,
				info`Consider migrating the project to bundler 3.x or removing it if is a leftover`
			);
		}

		const configFilePath = _configFile.asNative;

		this._configuration = fs.existsSync(configFilePath)
			? require(configFilePath)
			: {};
	}

	_loadPkgJson(): void {
		const pkgJsonPath = this.dir.join('package.json').asNative;

		this._pkgJson = fs.existsSync(pkgJsonPath)
			? readJsonSync(pkgJsonPath)
			: {};
	}

	/** Project relative path to build directory */
	private _buildDir: FilePath;

	/** Absolute path to config file */
	private _configFile: FilePath;

	private _configuration: object;
	private _pkgJson: PkgJson;
	private _pkgManager: PkgManager;

	/** Absolute path to project directory */
	private _projectDir: FilePath;

	/** Project relative paths to source directories */
	private _sources: FilePath[];

	/** Absolute path to tools directory (usually project or preset dir) */
	private _toolsDir: FilePath;

	/** Modules to export to the outside world */
	private _exports: Exports;

	/** Modules to import from the outside world */
	private _imports: Imports;

	/** User's webpack configuration */
	private _webpack: WebpackConfigProvider;

	private _versionsInfo: Map<string, VersionInfo>;
}

export default new Project('.');
