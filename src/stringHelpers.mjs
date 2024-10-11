// @ts-check

import { HTMLScrambler } from './HTMLScrambler.mjs';

export class stringHelpers {
	/**
	 * @param {string} docString
	 * @returns {string}
	 */
	static uncommentDocument = (docString) => {
		return docString.replace(
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
	 * @param {string} stringCheck
	 * @param {string[]} includes
	 * @returns {boolean}
	 */
	static likes = (stringCheck, ...includes) => {
		for (let i = 0; i < includes.length; i++) {
			if (stringCheck.includes(includes[i])) {
				return true;
			}
		}
		return false;
	};
	/**
	 * @param {string} content
	 */
	static closeVoidElement = (content) => {
		const voidTags = HTMLScrambler.__.voidElementTags();
		const voidElemRegex = new RegExp(`<(${voidTags.join('|')})([^>]*)>`, 'gim');
		return content.replace(voidElemRegex, '<$1$2 />');
	};
	/**
	 * Replace substrings or patterns in a string with other strings.
	 * @param {String} string - The input string to perform replacements on.
	 * @param {Array<[String|RegExp, String]>} searchsReplaces - An array of search strings (or regexp) and their corresponding replacement strings.
	 * @returns {String} - The modified string after replacements.
	 */
	static stringReplaces = (string, searchsReplaces) => {
		for (let i = 0; i < searchsReplaces.length; i++) {
			const [search, replace] = searchsReplaces[i];
			string = string.replace(search, replace);
		}
		return string;
	};
}
