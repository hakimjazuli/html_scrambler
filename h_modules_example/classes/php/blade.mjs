// @ts-check
import { builder_class } from '@html_first/html_scrambler';

export default class extends builder_class {
	/**
	 * Description
	 * @param {string} new_dir
	 * @param {string} data
	 */
	include = (new_dir, data = '[]') => {
		new_dir = `${new_dir}.blade.php`;
		const replace = `@include(${new_dir.toLowerCase().replace(/\\|\//g, '.')}, ${data});`;
		this.partial(new_dir, replace);
	};
}
