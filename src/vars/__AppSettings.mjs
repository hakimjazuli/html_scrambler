// @ts-check

import { __StringHelpers } from '../utils/__StringHelpers.mjs';

/**
 * @typedef {[open_tag:string,close_tag:string]} clossing_rules
 */
/**
 * @typedef {[String|RegExp, String]} filter_type
 */
/**
 * @typedef {string[]} void_element_tags_type
 */
/**
 * @typedef {Object.<string,Object.<string,string>>} resolver_type
 */

export class __AppSettings {
	/** @type {string} */
	_html_watch_path = 'builder/html_first/src';
	/** @type {string} */
	_instuction_classes_path = 'builder/html_first/classes';

	/**
	 * for the files inside folders
	 * @type {string}
	 */
	_public_subfolders_static = 'public';
	/**
	 * for files on the root folder
	 * @type {string}
	 */
	_public_root_static = 'public';
	/** @type {string} */
	_build_path = 'builder/html_first/result';
	/** @type {boolean} */
	_disable_indent = false;

	/** @type {resolver_type} */
	_attribute_resolver = {};
	/** @type {string} */
	_build_identifier = 'build';
	/** @type {string} */
	_build_prefix = 'b-';
	/** @type {[string,string,string]} */
	_separator = [';', ':', ','];
	/** @type {Object.<string,(clossing_rules)>} */
	_opening_closing_tags_rules = {};
	/** @type {void_element_tags_type} */
	_void_element_tags = [];
	/** @type {filter_type[]} */
	_filter = [];
	/**
	 * @type {Object.<string,string>}
	 */
	_replaces_filename_with = {};
	/**
	 * @readonly
	 * @returns {resolver_type}
	 */
	attribute_resolver = () => {
		return Object.assign(this._attribute_resolver, {
			jsx: { class: 'className' },
			tsx: { class: 'className' },
		});
	};
	/**
	 * @readonly
	 * @returns {string}
	 */
	uncomment_identifier = () => `${this._build_prefix}attr`;
	/**
	 * @readonly
	 * @returns {void_element_tags_type}
	 */
	void_element_tags = () => {
		return [
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
		].concat(this._void_element_tags);
	};
	/**
	 * @readonly
	 * @returns {filter_type[]|[]}
	 */
	indent_filter = () => {
		if (this._disable_indent) {
			return [[/^[\s]+| {2,}/gm, '']];
		}
		return [];
	};
	/**
	 * @readonly
	 * @returns {filter_type[]}
	 */
	filter = () => {
		return [
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
			...this._filter,
			...this.indent_filter(),
		];
	};
	/**
	 * @readonly
	 * @returns {Object.<string,(clossing_rules)>}
	 */
	opening_closing_tags_rules = () => {
		return Object.assign(this._opening_closing_tags_rules, {
			jsx: ['{/* b-build: start */}', '{/* b-build: end */}'],
			tsx: ['{/* b-build: start */}', '{/* b-build: end */}'],
			default: ['<!-- b-build: start -->', '<!-- b-build: end -->'],
		});
	};
	/**
	 * @param {number} index
	 */
	instruction = (index) => `${this._build_prefix}${index}`;
	/**
	 * @readonly
	 * @type {string[]}
	 */
	extentions = [
		'mjs',
		// 'js' /** temporary drop js and ts support */, 'ts'
	];
	/**
	 * @readonly
	 * @type {string}
	 */
	content_regex = '([\\s\\S]*?)';
	/**
	 * @type {string}
	 */
	get_bases;

	/** @type {__AppSettings} */
	static __;
	constructor() {
		this.get_bases = process.cwd();
		__AppSettings.__ = this;
	}
	/**
	 * @readonly
	 * @param {string} file_path
	 * @returns {clossing_rules}
	 */
	export_identifier = (file_path) => {
		const closing_tags = this.opening_closing_tags_rules();
		if (file_path in closing_tags) {
			return closing_tags[file_path];
		} else {
			return closing_tags.default;
		}
	};
	/**
	 * @readonly
	 */
	colors = {
		reset: '\x1b[0m',
		warning: '\x1b[32m',
	};
	/**
	 * Description
	 * @param {string} text
	 * @returns {string}
	 */
	colorize_ = (text) => {
		return `${this.colors.warning}${text}${this.colors.reset}`;
	};
}
