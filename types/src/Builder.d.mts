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
    static get document(): Document;
    /**
     * @returns {Element|HTMLElement}
     */
    static get element(): Element | HTMLElement;
    static splitX: (string: string, delimiter: string) => string[];
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
     * @param {string} elementString
     * @param {boolean} [onlyInner]
     */
    static replaceWith: (elementString: string, onlyInner?: boolean) => void;
    /**
     * @param {Object} options
     * @param {string} options.newDir
     * @param {boolean} options.saveOnlyInner
     * @param {boolean} options.replaceOnlyInner
     * @param {false|string} [options.replace]
     */
    static partial: ({ newDir, replace, replaceOnlyInner, saveOnlyInner }: {
        newDir: string;
        saveOnlyInner: boolean;
        replaceOnlyInner: boolean;
        replace?: false | string;
    }) => Promise<void>;
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
