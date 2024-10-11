// @ts-check

import { HTMLScrambler } from './HTMLScrambler.mjs';

/**
 * @description
 * - create a file with exported default by extending this class with static method instructions;
 * ```js
 * // on `${_builderClassFolderPath}/someClass.mjs`
 * // @ts-check
 * import { Builder } from '@html_first/html_scrambler'
 * export default class extends Builder{
 * 	// args': string[];
 * 	static someMethod = (...args) => {
 * 		// code
 * 	}
 * }
 * ```
 * - usage on `*.html` file:
 * ```html
 * <div build b-1="someClass;someMethod;arg0;arg1" b-2="otherClass;otherMethod;...args">
 * 	divInnerHTML
 * </div>
 * ```
 * > - notice that `b-${index}` are incrementaly increases, the lib expect `[build]` to have b-1 and increases incrementaly by `1`, if the element has no `b-${next}` it will ignore any `b-`'s afterward;
 * > - this `attributeNameIdentification` can be changed using [`HTMLScrambler`](#htmlscrambler) `options._buildAttrIdentifier` and `options._buildPrefix` respectively on that order;
 * > > - preferably use dash "`-`" as word separator;
 * > > - don't use colon "`:`" as word separator;
 * - check on copyed `/builder/html_first/classes/` for examples on how to use;
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
	 * @param {Object} options
	 * @param {string} options.newDir
	 * @param {boolean} options.saveOnlyInner
	 * @param {boolean} options.replaceOnlyInner
	 * @param {false|string} [options.replace]
	 */
	static partial = async ({ newDir, replace = false, replaceOnlyInner, saveOnlyInner }) => {
		await HTMLScrambler.saveTo(newDir, async () => {
			return saveOnlyInner;
		});
		if (replace !== false) {
			this.replaceWith(replace, replaceOnlyInner);
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
