// @ts-check
import { builder } from 'html_scrambler';

const app = new builder({
	main_static_path: 'public',
	build_path: 'server',
	classes_path: 'app_modules/classes_example',
	watch_path: 'h_export',
	re_name: {
		search: '.html',
		replace: '.php',
	},
});
app.watch();
