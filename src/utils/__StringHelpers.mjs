// @ts-check

import { __AppSettings } from '../vars/__AppSettings.mjs';

export class __StringHelpers {
	/** @type {__StringHelpers} */
	static __;
	constructor() {
		__StringHelpers.__ = this;
	}
	/**

	 * @param {string} doc_string
	 * @returns {string}
	 */
	uncomment_document = (doc_string) => {
		return doc_string.replace(
			new RegExp(`${__AppSettings.__.uncomment_identifier()}="([^"]+)"`, 'g'),
			'$1'
		);
	};
	/**

	 * @param {string} str
	 */
	escape_reg_exp = (str) => {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};
	/**

	 * @param {String} path_
	 * @returns {String}
	 */
	standard_relative_refs_ = (path_) => {
		return path_.replace(/^\/+|\/+$/g, '');
	};
	/**

	 * @param {String} path_
	 * @returns {String}
	 */
	standard_path_ = (path_) => {
		return this.standard_relative_refs_(path_.replace(/\\+/g, '/'));
	};
	/**

	 * @param {String} string
	 * @returns {String}
	 */
	interpret_special_chars = (string) => {
		return this.string_replaces(string, __AppSettings.__.filter());
	};
	/**

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

	 * @param {string} content
	 */
	close_void_element = (content) => {
		const void_tags = __AppSettings.__.void_element_tags();
		const void_elem_regex = new RegExp(`<(${void_tags.join('|')})([^>]*)>`, 'gim');
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
