// @ts-check
import { Builder } from '@html_first/html_scrambler';

export default class extends Builder {
	/**
	 * @param {string} newDir
	 * @param {string} data
	 */
	static include = (newDir, data = '[]') => {
		newDir = `${newDir}.blade.php`;
		const replace = `\n@include(${newDir.toLowerCase().replace(/\\|\//g, '.')}, ${data});\n`;
		Builder.partial({ newDir, replaceOnlyInner: false, replace, saveOnlyInner: false });
	};
}
