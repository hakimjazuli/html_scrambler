// @ts-check

import { HTMLScrambler } from './HTMLScrambler.mjs';

export class stringHelpers {
	/**
	 * @param {string} doc_string
	 * @returns {string}
	 */
	static uncommentDocument = (doc_string) => {
		return doc_string.replace(
			new RegExp(`${HTMLScrambler.__.uncommentIdentifier()}="([^"]+)"`, 'g'),
			'$1'
		);
	};
	/**
	 * @param {string} str
	 */
	static escapeRegExp = (str) => {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};
	/**
	 * @param {String} path_
	 * @returns {String}
	 */
	static standardRelativeRefs = (path_) => {
		return path_.replace(/^\/+|\/+$/g, '');
	};
	/**
	 * @param {String} path_
	 * @returns {String}
	 */
	static standardPath = (path_) => {
		return stringHelpers.standardRelativeRefs(path_.replace(/\\+/g, '/'));
	};
	/**
	 * @param {String} string
	 * @returns {String}
	 */
	static interpretSpecialChars = (string) => {
		return stringHelpers.stringReplaces(string, HTMLScrambler.__.filter());
	};
	/**
	 * @param {string} string_check
	 * @param {string[]} includes
	 * @returns {boolean}
	 */
	static likes = (string_check, ...includes) => {
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
	static closeVoidElement = (content) => {
		const void_tags = HTMLScrambler.__.voidElementTags();
		const void_elem_regex = new RegExp(`<(${void_tags.join('|')})([^>]*)>`, 'gim');
		return content.replace(void_elem_regex, '<$1$2 />');
	};
	/**
	 * Replace substrings or patterns in a string with other strings.
	 * @param {String} string - The input string to perform replacements on.
	 * @param {Array<[String|RegExp, String]>} searchs_replaces - An array of search strings (or regexp) and their corresponding replacement strings.
	 * @returns {String} - The modified string after replacements.
	 */
	static stringReplaces = (string, searchs_replaces) => {
		for (let i = 0; i < searchs_replaces.length; i++) {
			const [search, replace] = searchs_replaces[i];
			string = string.replace(search, replace);
		}
		return string;
	};
}
