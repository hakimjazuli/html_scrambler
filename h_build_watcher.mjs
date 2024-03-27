// @ts-check
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

export class h_build_watcher {
	/**
	 * @param {import('./builder.mjs').builder} builder
	 */
	constructor(builder) {
		this.builder = builder;
	}
	run = () => {
		const watcher = chokidar.watch([this.builder.watch_path, this.builder.classes_path], {
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
		console.info(`\nstarts watching: "${this.builder.base_path}"\n`, 'Press Ctrl+C to exit.');
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
	html_contents = {};
	/**
	 * @private
	 * @param {string} path
	 * @param {boolean} is_change
	 */
	handle_path = async (path, is_change = false) => {
		if (!path.startsWith(this.builder.watch_path)) {
			if (is_change) {
				await this.builder.handle_html_all();
				console.info(`render build for all "${this.builder.watch_path}/*.html"`);
				return;
			}
		} else if (!path.includes('.html')) {
			this.copy_file(
				path,
				path.replace(this.builder.watch_path, this.builder.main_static_path)
			);
			return;
		} else {
			await this.builder.handle_html(path);
			console.info(`render build for "${path}"`);
		}
	};
}
