/**
 * SPDX-FileCopyrightText: © 2017 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import globby from 'globby';
import FilePath from 'liferay-npm-build-tools-common/lib/file-path';
import {print, error} from 'liferay-npm-build-tools-common/lib/format';
import {getPackageTargetDir} from 'liferay-npm-build-tools-common/lib/packages';
import project from 'liferay-npm-build-tools-common/lib/project';
import path from 'path';
import PkgDesc from 'liferay-npm-build-tools-common/lib/pkg-desc';

/**
 * Abort build and exit with return code 1
 *
 * @param message optional message to show before aborting
 */
export function abort(message?: string): void {
	if (message) {
		print(error`${message}`);
	}

	process.exit(1);
}

/**
 * Perform a glob search of files and return their paths referenced to
 * `baseDir` without leading `./`.
 *
 * Note that the globs are not altered in any way and may even point to files
 * outside of the project directory.
 *
 * @param baseDirPath a native directory path
 * @param globs
 * globs in `globby` format (may include `.` and `..` but must be in POSIX
 * format, i.e.: use `/` path separator)
 * @return an array containing native file paths relative to `baseDirPath`
 */
export function findFiles(baseDirPath: string, globs: string[]): string[] {
	return globby
		.sync(globs, {
			absolute: true,
			onlyFiles: true,
			followSymbolicLinks: false,
		})
		.map(absPath => path.relative(baseDirPath, absPath))
		.map(baseDirRelPath => new FilePath(baseDirRelPath, {posix: true}))
		.map(file => file.asNative);
}

/**
 * Get the project relative path to the destination directory of a package.
 *
 * @return native path to destination directory of package
 */
export function getDestDir(pkg: PkgDesc): string {
	return pkg.isRoot
		? project.dir.join(project.buildDir).asNative
		: project.buildDir.join(
				'node_modules',
				getPackageTargetDir(pkg.name, pkg.version)
		  ).asNative;
}

/**
 * Iterate through the elements of an array applying an async process serially
 * to each one of them.
 *
 * @param values array of values to be iterated
 * @param asyncProcess
 * the async process (that returns a Promise) to be executed on each value
 * @return a Promise that is resolved as soon as the iteration finishes
 */
export function iterateSerially<T>(
	values: T[],
	asyncProcess: {(value: T): Promise<void>}
) {
	if (values.length == 0) {
		return Promise.resolve();
	}

	return asyncProcess(values[0]).then(() =>
		iterateSerially(values.slice(1), asyncProcess)
	);
}

/**
 * Run an async process over a series of items, applying the process chunk by
 * chunk.
 *
 * This is especially useful to maintain an upper bound on the maximum number of
 * open files so as to avoid EMFILE errors.
 */
export function runInChunks<T>(
	items: T[],
	chunkSize: number,
	chunkIndex: number,
	callback: {(item: T): Promise<void>}
) {
	const chunksCount = Math.floor((items.length + chunkSize - 1) / chunkSize);

	const chunk = items.slice(
		chunkIndex * chunkSize,
		Math.min(items.length, (chunkIndex + 1) * chunkSize)
	);

	return Promise.all(chunk.map(item => callback(item))).then(() => {
		chunkIndex++;

		if (chunkIndex < chunksCount) {
			return runInChunks(items, chunkSize, chunkIndex, callback);
		}
	});
}
