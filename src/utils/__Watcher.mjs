// @ts-check
import fs from 'fs';
import path, { join } from 'path';
import process from 'process';
import chokidar from 'chokidar';
import { __AppSettings } from '../vars/__AppSettings.mjs';
import { Builder } from './Builder.mjs';
import { __StringHelpers } from './__StringHelpers.mjs';

export class __Watcher {
	/** @type {__Watcher} */
	static __;
	/** @type {string} */
	base_path;
	/**
	 * @param {typeof import('../vars/__AppSettings.mjs').__AppSettings} AppSettings
	 */
	constructor(AppSettings) {
		this.base_path = process.cwd();
		new AppSettings();
		const __app_settings = __AppSettings.__;
		this.watch_path = join(this.base_path, __app_settings._html_watch_path);
		this.instuction_classes_path = join(
			this.base_path,
			__app_settings._instuction_classes_path
		);
		new __StringHelpers();
		new Builder();
		__Watcher.__ = this;
	}
	/** @string */
	watch_path;
	/** @string */
	instuction_classes_path;
	/**
	 * @param {[path:string,callback:()=>Promise<void>][]} [path_callback]
	 */
	run = (path_callback = undefined) => {
		const paths = [this.watch_path, this.instuction_classes_path];
		if (path_callback) {
			for (let i = 0; i < path_callback.length; i++) {
				const [path_, callback] = path_callback[i];
				const path__ = path.join(this.base_path, path_);
				path_callback[i] = [path__, callback];
				paths.push(path__);
			}
		}
		console.log({ paths });
		const watcher = chokidar.watch(paths, {
			ignored: /[\/\\]\./,
			persistent: true,
		});
		watcher
			.on('add', async (path) => {
				await this.handle_path(path, false, path_callback);
			})
			.on('change', async (path) => {
				await this.handle_path(path, true, path_callback);
			});
		process.on('exit', (code) => {
			console.log('Exiting...');
			watcher.close();
		});
		process.on('SIGINT', () => {
			console.log('Received SIGINT. Exiting...');
			process.exit(0);
		});
		console.info(`\nstarts watching: "${this.base_path}"\n`, 'Press Ctrl+C to exit.');
	};
	/**
	 * @private
	 * @param {string} source
	 * @param {string} target
	 */
	copy_file = (source, target) => {
		const targetDir = path.dirname(target);
		fs.mkdir(targetDir, { recursive: true }, (err) => {
			fs.copyFileSync(source, target);
			console.info(`copy file from: "${source}" to: "${target}"`);
		});
	};
	/**
	 * @private
	 * @param {string} path_
	 * @param {boolean} is_change
	 * @param {[path:string,callback:()=>Promise<void>][]} [path_callback]
	 */
	handle_path = async (path_, is_change, path_callback = undefined) => {
		const __app_settings = __AppSettings.__;
		const watch_path = this.watch_path;
		const builder = new Builder();
		if (path_callback) {
			for (let i = 0; i < path_callback.length; i++) {
				const [path__, callback] = path_callback[i];
				if (path_.startsWith(path__)) {
					await callback();
					console.info(`render ${__app_settings.colorize_('custom run')} for ${path__}`);
					return;
				}
			}
		}
		if (!path_.startsWith(watch_path)) {
			if (is_change) {
				await builder.handle_html_all();
				console.info(
					`render build for ${__app_settings.colorize_('ALL OF')} "${watch_path}/*.html"`
				);
				return;
			}
		} else if (!path_.endsWith('.html')) {
			this.copy_file(
				path_,
				path_.replace(watch_path, path.join(this.base_path, __app_settings._public_static))
			);
			return;
		} else {
			await builder.handle_html(path_);
			console.info(`render build for ${__app_settings.colorize_('SINGLE')} "${path_}"`);
		}
	};
}
