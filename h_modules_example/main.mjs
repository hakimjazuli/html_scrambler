// @ts-check
import { h_watcher } from '@html_first/html_scrambler';

const watcher = new h_watcher({
	classes_path: 'h_modules_example/classes',
	watch_path: 'h_modules_example/h_export',
});
watcher.run({
	build_path: 'server',
	main_static_path: 'public',
	replace: {
		search: '.html',
		replace: '.php',
	},
});
