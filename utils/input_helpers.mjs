// @ts-check

export class input_helpers {
	/**
	 * Description
	 * @returns {String}
	 */
	get_bases = () => {
		return process.cwd();
	};
	/**
	 * Description
	 * @param {import('./b_build.mjs').b_build} b_build
	 */
	constructor(b_build) {
		this.b_build = b_build;
	}
	/**
	 * Description
	 * @param {string} doc_string
	 * @returns {string}
	 */
	uncomment_document = (doc_string) => {
		return doc_string.replace(
			new RegExp(`${this.b_build.helper.uncomment_identifier()}="([^"]+)"`, 'g'),
			'$1'
		);
	};
	/**
	 * Description
	 * @param {string} str
	 */
	escape_reg_exp = (str) => {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};
	/**
	 * Description
	 * @param {String} path_
	 * @returns {String}
	 */
	standard_relative_refs_ = (path_) => {
		return path_.replace(/^\/+|\/+$/g, '');
	};
	/**
	 * Description
	 * @param {String} path_
	 * @returns {String}
	 */
	standard_path_ = (path_) => {
		return this.standard_relative_refs_(path_.replace(/\\+/g, '/'));
	};
	/**
	 * Description
	 * @param {String} string
	 * @param {{
	 * disable_indents?:boolean,
	 * additional_filter?:Array<[search:(string|RegExp),replace:string]>,
	 * }|{}} [option]
	 * @returns {String}
	 */
	interpret_special_chars = (string, option = {}) => {
		// @ts-ignore
		const { disable_indents = false, additional_filter = [] } = option;
		const interpreter_ = [
			[/\&lt;/g, '<'],
			[/\&quot;/g, '"'],
			[/\&gt;/g, '>'],
			[/<!--\?/g, '<?'],
			[/\?-->/g, '?>'],
			[/--->/g, '->'],
			[
				/** reprocessing interpret_special_chars with document.outerHTML will break things(in this case the uncommented b-attr), therefor this array and after is needed; */
				/\s*(.*?)\s*=""/g,
				' $1',
			],
			[/<\?="(.*?)\?">/g, '<?= $1 ?>'],
		];
		interpreter_.push(...additional_filter);
		if (disable_indents) {
			interpreter_.push([/^[\s]+| {2,}/gm, '']);
		}
		// @ts-ignore
		return this.string_replaces(string, interpreter_);
	};
	/**
	 * Description
	 * @param {string} string_check
	 * @param {string[]} includes
	 * @returns {boolean}
	 */
	likes = (string_check, ...includes) => {
		for (let i = 0; i < includes.length; i++) {
			if (string_check.includes(includes[i])) {
				return true;
			}
		}
		return false;
	};
	/**
	 * Description
	 * @param {string} content
	 * @param {[tag_name:string]|[]} void_elems_tag
	 */
	close_void_element = (content, void_elems_tag = []) => {
		const void_elements = [
			'area',
			'base',
			'br',
			'col',
			'command',
			'embed',
			'hr',
			'img',
			'input',
			'keygen',
			'link',
			'meta',
			'param',
			'source',
			'track',
			'wbr',
		];
		void_elements.push(...void_elems_tag);
		const void_elem_regex = new RegExp(`<(${void_elements.join('|')})([^>]*)>`, 'gim');
		return content.replace(void_elem_regex, '<$1$2 />');
	};
	/**
	 * Replace substrings or patterns in a string with other strings.
	 * @param {String} string - The input string to perform replacements on.
	 * @param {Array<[String|RegExp, String]>} searchs_replaces - An array of search strings (or regexp) and their corresponding replacement strings.
	 * @returns {String} - The modified string after replacements.
	 */
	string_replaces = (string, searchs_replaces) => {
		for (let i = 0; i < searchs_replaces.length; i++) {
			const [search, replace] = searchs_replaces[i];
			string = string.replace(search, replace);
		}
		return string;
	};
}
