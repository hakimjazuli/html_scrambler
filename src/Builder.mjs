// @ts-check

import { HTMLScrambler } from './HTMLScrambler.mjs';

/**
 * @description
 * - create a file with exported default by extending this class with static method instructions;
 * ```js
 * // @ts-check
 * import { Builder } from '@html_first/html_scrambler'
 * export default class extends Builder{
 * 	// args': string[];
 * 	static someMethod = (...args) => {
 * 		// code
 * 	}
 * }
 * ```
 */
export class Builder {
	/**
	 * @returns {Document}
	 */
	static get document() {
		return HTMLScrambler.document;
	}
	/**
	 * @returns {Element|HTMLElement}
	 */
	static get element() {
		return HTMLScrambler.element;
	}
	static splitX = HTMLScrambler.splitX;
	/**
	 * @param {string} elementString
	 * @param {boolean} [onlyInner]
	 */
	static replaceWith = (elementString, onlyInner = false) => {
		if (onlyInner) {
			HTMLScrambler.element.innerHTML = elementString;
			return;
		}
		this.startWith(elementString, onlyInner);
		HTMLScrambler.element.remove();
	};
	/**
	 * @param {string} argumentOpen
	 * @param {string} argumentClose
	 * @param {false|string} [surroundInner]
	 * - false default: surround outerHTML
	 * - true;
	 */
	static surroundWith = (argumentOpen, argumentClose, surroundInner = false) => {
		const textBefore = HTMLScrambler.document.createTextNode(argumentOpen);
		const textAfter = HTMLScrambler.document.createTextNode(argumentClose);
		if (surroundInner) {
			const parentNode = HTMLScrambler.element;
			const elem = HTMLScrambler.element.childNodes[0];
			parentNode.insertBefore(textBefore, elem);
			parentNode.insertBefore(textAfter, elem.nextSibling);
			return;
		}
		const parentNode = HTMLScrambler.element.parentNode;
		if (!parentNode) {
			return;
		}
		parentNode.insertBefore(textBefore, HTMLScrambler.element);
		parentNode.insertBefore(textAfter, HTMLScrambler.element.nextSibling);
	};
	/**
	 * @param {string} openArguments
	 * @param {boolean} [prefixInner]
	 * - false default: prefixs outerHTML
	 * - true;
	 */
	static startWith = (openArguments, prefixInner = false) => {
		const textBefore = HTMLScrambler.document.createTextNode(openArguments);
		if (prefixInner) {
			const parentNode = HTMLScrambler.element;
			const elem = HTMLScrambler.element.childNodes[0];
			parentNode.insertBefore(textBefore, elem);
			return;
		}
		const parentNode = HTMLScrambler.element.parentNode;
		if (!parentNode) {
			return;
		}
		parentNode.insertBefore(textBefore, HTMLScrambler.element);
	};
	/**
	 * @param {string} closeArgument
	 * @param {boolean} [suffixsInner]
	 * - false default: suffixs outerHTML
	 * - true;
	 */
	static endWith = (closeArgument, suffixsInner = false) => {
		const textAfter = HTMLScrambler.document.createTextNode(closeArgument);
		if (suffixsInner) {
			const parentNode = HTMLScrambler.element;
			const elem = HTMLScrambler.element.childNodes[0];
			parentNode.insertBefore(textAfter, elem.nextSibling);
			return;
		}
		const parentNode = HTMLScrambler.element.parentNode;
		if (!parentNode) {
			return;
		}
		parentNode.insertBefore(textAfter, HTMLScrambler.element.nextSibling);
	};
	/**
	 * @param {string} newTag
	 */
	static tag = async (newTag) => {
		const buildElementAttribute = HTMLScrambler.element.attributes;
		const newElement = HTMLScrambler.document.createElement(newTag);
		for (var i = 0; i < buildElementAttribute.length; i++) {
			const attribute = buildElementAttribute[i];
			newElement.setAttribute(attribute.name, attribute.value);
		}
		newElement.innerHTML = HTMLScrambler.element.innerHTML;
		const parentNode = HTMLScrambler.element.parentNode;
		if (parentNode) {
			parentNode.replaceChild(newElement, HTMLScrambler.element);
		}
	};
	/**
	 * @param {string} attribute
	 */
	static customAttr = async (attribute) => {
		const uncommentIdentifier = HTMLScrambler.__.uncommentIdentifier();
		let attribute_ = '';
		if (HTMLScrambler.element.hasAttribute(HTMLScrambler.__.uncommentIdentifier())) {
			// @ts-ignore
			attribute_ = HTMLScrambler.element.getAttribute(uncommentIdentifier);
		}
		HTMLScrambler.element.setAttribute(
			uncommentIdentifier,
			`${attribute_} ${attribute}`.trim()
		);
	};
	/**
	 * @param {string} newDir
	 * @param {false|string} replace
	 * replace original element (in the parent file) with string
	 */
	static partial = (newDir, replace = false) => {
		HTMLScrambler.saveTo(newDir, async () => {
			if (replace !== false) {
				this.replaceWith(`${replace}\n`);
				return false;
			}
			return true;
		});
		if (replace !== false) {
			HTMLScrambler.element.innerHTML = replace;
		}
	};
	/**
	 * @private
	 * @param {number} index
	 */
	static getCurrentValidIndex = (index) => {
		index++;
		while (HTMLScrambler.element.hasAttribute(`${HTMLScrambler.__._buildPrefix}${index}`)) {
			index++;
		}
		return index;
	};
	/**
	 * @protected
	 * @param {string[]} arguments_
	 */
	static setBNext = (...arguments_) => {
		HTMLScrambler.element.setAttribute(
			`${HTMLScrambler.__.instruction(this.getCurrentValidIndex(HTMLScrambler.index))}`,
			arguments_.join(HTMLScrambler.__._separator[0])
		);
	};
}
