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
		console.info(`starts watching: "${this.builder.base_path}"`);
		const watcher = chokidar.watch(this.builder.watch_path, {
			ignored: /[\/\\]\./,
			persistent: true,
		});
		watcher
			.on('add', async (path) => {
				await this.handle_path(path);
			})
			.on('change', async (path) => {
				await this.handle_path(path);
			});
		const engine = chokidar.watch(this.builder.classes_path, {
			ignored: /[\/\\]\./,
			persistent: true,
		});
		engine.on('change', async () => {
			await this.builder.handle_html_all();
		});
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
	 */
	handle_path = async (path) => {
		if (!path.includes('.html')) {
			this.copy_file(
				path,
				path.replace(this.builder.watch_path, this.builder.main_static_path)
			);
			return;
		}
		await this.builder.handle_html(path);
		console.info(`render build for "${path}"`);
	};
}
