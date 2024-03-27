// @ts-check
import { h_watcher } from '@html-first/html_scrambler';

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
