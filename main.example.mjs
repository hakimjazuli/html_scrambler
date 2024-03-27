// @ts-check
import { h_watcher } from 'html_scrambler/utils/h_watcher.mjs';

const watcher = new h_watcher({
	classes_path: 'app_modules/classes',
	watch_path: 'h_export',
});
watcher.run({
	build_path: 'server',
	main_static_path: 'public',
	replace: {
		search: '.html',
		replace: '.php',
	},
});
