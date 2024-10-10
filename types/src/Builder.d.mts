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
    static get document(): Document;
    /**
     * @returns {Element|HTMLElement}
     */
    static get element(): Element | HTMLElement;
    static splitX: (string: string, delimiter: string) => string[];
    /**
     * @param {string} elementString
     * @param {boolean} [onlyInner]
     */
    static replaceWith: (elementString: string, onlyInner?: boolean) => void;
    /**
     * @param {string} argumentOpen
     * @param {string} argumentClose
     * @param {false|string} [surroundInner]
     * - false default: surround outerHTML
     * - true;
     */
    static surroundWith: (argumentOpen: string, argumentClose: string, surroundInner?: false | string) => void;
    /**
     * @param {string} openArguments
     * @param {boolean} [prefixInner]
     * - false default: prefixs outerHTML
     * - true;
     */
    static startWith: (openArguments: string, prefixInner?: boolean) => void;
    /**
     * @param {string} closeArgument
     * @param {boolean} [suffixsInner]
     * - false default: suffixs outerHTML
     * - true;
     */
    static endWith: (closeArgument: string, suffixsInner?: boolean) => void;
    /**
     * @param {string} newTag
     */
    static tag: (newTag: string) => Promise<void>;
    /**
     * @param {string} attribute
     */
    static customAttr: (attribute: string) => Promise<void>;
    /**
     * @param {string} newDir
     * @param {false|string} replace
     * replace original element (in the parent file) with string
     */
    static partial: (newDir: string, replace?: false | string) => void;
    /**
     * @private
     * @param {number} index
     */
    private static getCurrentValidIndex;
    /**
     * @protected
     * @param {string[]} arguments_
     */
    protected static setBNext: (...arguments_: string[]) => void;
}
