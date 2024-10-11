// @ts-check
import { Builder } from '@html_first/html_scrambler';

export default class extends Builder {
	/**
	 * @param {string} new_dir
	 * @param {string} data
	 */
	static include = (new_dir, data = '[]') => {
		new_dir = `${new_dir}.blade.php`;
		const replace = `\n@include(${new_dir.toLowerCase().replace(/\\|\//g, '.')}, ${data});\n`;
		Builder.partial(new_dir, replace);
	};
}
