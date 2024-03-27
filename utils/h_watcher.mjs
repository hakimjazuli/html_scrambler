// @ts-check
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { h_builder } from './h_builder.mjs';
/**
 * @typedef h_watcher_option
 * @property {string} classes_path
 * @property {string} watch_path
 */

export class h_watcher {
	/** @type {string} */
	watch_path;
	/** @type {string} */
	classes_path;
	/** @type {string} */
	base_path;
	/**
	 * @param {h_watcher_option} options
	 */
	constructor({ classes_path, watch_path }) {
		this.base_path = process.cwd();
		this.classes_path = path.join(this.base_path, classes_path);
		this.watch_path = path.join(this.base_path, watch_path);
	}
	/**
	 * @typedef {import('./h_builder.mjs').h_builder_options} h_builder_options
	 * @type {h_builder_options}
	 */
	options;
	/**
	 * Description
	 * @param {h_builder_options} options
	 */
	run = (options) => {
		this.options = options;
		const watcher = chokidar.watch([this.watch_path, this.classes_path], {
			ignored: /[\/\\]\./,
			persistent: true,
		});
		watcher
			.on('add', async (path) => {
				await this.handle_path(path);
			})
			.on('change', async (path) => {
				await this.handle_path(path, true);
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
	 * @param {boolean} [is_change]
	 */
	handle_path = async (path_, is_change = false) => {
		const h_builder_ = new h_builder(this, this.options);
		if (!path_.startsWith(this.watch_path)) {
			if (is_change) {
				await h_builder_.handle_html_all();
				console.info(`render build for all "${this.watch_path}/*.html"`);
				return;
			}
		} else if (!path_.endsWith('.html')) {
			this.copy_file(
				path_,
				path_.replace(
					this.watch_path,
					path.join(this.base_path, this.options.main_static_path)
				)
			);
			return;
		} else {
			await h_builder_.handle_html(path_);
			console.info(`render build for "${path_}"`);
		}
	};
}
