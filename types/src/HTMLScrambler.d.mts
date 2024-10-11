/**
 * @typedef {[openTag:string,closeTag:string]} clossingRules
 */
/**
 * @typedef {[String|RegExp, String]} filterType
 */
/**
 * @typedef {string[]} voidElementTagsType
 */
/**
 * @typedef {Record<string,Record<string,string>>} resolverType
 */
/**
 * @description
 * - assign folder watcher by instantiating this class;
 * ```js
 * // @ts-check
 * import { HTMLScrambler } from '@html_first/html_scrambler'
 *
 * new HTMLScrambler({...options}).run(...pathCallbacks);
 * ```
 * - initiate watcher by adding script to your `package.json` scripts object
 * ```json
 * {...
 * "scripts":{
 * 	...
 * 	"scrambler":"node ./path/to/thisInstance/file.mjs",
 * 	...
 * }
 * ...
 * }
 * ```
 * - then
 *
 * ```shell
 * npm run scrambler
 * ```
 */
export class HTMLScrambler {
    /**
     * @public
     * @type {HTMLScrambler}
     */
    public static __: HTMLScrambler;
    /**
     * @type {Document}
     */
    static document: Document;
    /**
     * @type {Element|HTMLElement}
     */
    static element: Element | HTMLElement;
    /**
     * @type {number}
     */
    static index: number;
    /**
     * @private
     * @type {Record<string, import('./Builder.mjs').Builder>}
     */
    private static instances;
    /**
     * @private
     * @param {string} watchPath
     * @returns {Promise<void>}
     */
    private static handleHtmlAll;
    /**
     * @private
     * @param {string} htmlPath
     * @returns {Promise<void>}
     */
    private static handleHtml;
    /**
     * split with escapeString `/`
     * @public
     * @param {string} string
     * @param {string} delimiter
     */
    public static splitX: (string: string, delimiter: string) => string[];
    /**
     * @private
     * @returns {Promise<void>}
     */
    private static perElement;
    /**
     * @private
     * @param {string} className
     */
    private static loadBuilderClass;
    /**
     * @private
     * @param {string} fullPathNoExt
     * @param {string} ext
     */
    private static classesExist;
    /**
     * @private
     * @param {string} filePath
     * @param {string} dirPath
     * @param {string} content
     */
    private static handleSave;
    /**
     * @private
     * @param {HTMLElement|Element} element
     * @param {string} newAttributeName
     * @param {string} attribute
     */
    private static attributeResolverSingle;
    /**
     * @private
     * @param {string} filePath
     * @param {boolean} [checkElementAttribute]
     */
    private static attributeResolver;
    /**
     * @public
     * @param {string} filePath
     * @param {()=>Promise<boolean>} asyncCallback
     * return boolan whether to use only innerHTML (or outerHTML)
     * - false default;
     * - true: save only innerHTML of the element to filepath
     */
    public static saveTo: (filePath: string, asyncCallback: () => Promise<boolean>) => Promise<void>;
    /**
     * @param {Object} settings
     * @param {string} [settings._htmlWatchPath]
     * @param {string} [settings._builderClassInstanceFolderPath]
     * @param {string} [settings._publicSubfoldersStatic]
     * - send non-`*.html` files that are on the subFolders to this string `path`;
     * @param {string} [settings._publicRootStatic]
     * - send non-`*.html` files that are on the root to this string `path`;
     * @param {string} [settings._buildPath]
     * - send `*.html` files to this path;
     * @param {boolean} [settings._disableIndent]
     * @param {resolverType} [settings._renameAttribute]
     * - key: `fileExtention`;
     * > - value.key: `originalAttributeName`;
     * > - value.value: `onExportRenameAttributeTo`;
     * @param {string} [settings._buildAttrIdentifier]
     * - html element with this `attributeName` will be processed;
     * @param {string} [settings._buildPrefix]
     * - `attributeName` prefix to call builder;
     * @param {[string,string,string]} [settings._separator]
     * - _separator[0]: main separator for instruction for "className;method;...parameters";
     * - _separator[1]: secondary separator to be used in tandem with `builderClassInstance.splitX`;
     * - _separator[2]: tertiary separator to be used in tandem with `builderClassInstance.splitX`
     * @param {Record<string,(clossingRules)>} [settings._openingClosingTagsRules]
     * - `key`: file extention;
     * - `value`: [openingTag:string,closingTag:string]
     * @param {voidElementTagsType} [settings._voidElementTags]
     * - register additonal self closing tag [...`tagNames`];
     * @param {filterType[]} [settings._replaceStringWith]
     * - [...[string|regExp,string]];
     * @param {Record<string,string>} [settings._replacesFilenameWith]
     */
    constructor({ _htmlWatchPath, _builderClassInstanceFolderPath, _publicRootStatic, _publicSubfoldersStatic, _buildPath, _buildAttrIdentifier, _buildPrefix, _disableIndent, _separator, _renameAttribute, _openingClosingTagsRules, _replacesFilenameWith, _replaceStringWith, _voidElementTags, }: {
        _htmlWatchPath?: string;
        _builderClassInstanceFolderPath?: string;
        _publicSubfoldersStatic?: string;
        _publicRootStatic?: string;
        _buildPath?: string;
        _disableIndent?: boolean;
        _renameAttribute?: resolverType;
        _buildAttrIdentifier?: string;
        _buildPrefix?: string;
        _separator?: [string, string, string];
        _openingClosingTagsRules?: Record<string, (clossingRules)>;
        _voidElementTags?: voidElementTagsType;
        _replaceStringWith?: filterType[];
        _replacesFilenameWith?: Record<string, string>;
    });
    /**
     * @private
     * @type {string}
     */
    private _htmlWatchPath;
    /**
     * @private
     * @type {string}
     */
    private _builderClassInstanceFolderPath;
    /**
     * @private
     * @type {string}
     */
    private _publicRootStatic;
    /**
     * @private
     * @type {string}
     */
    private _publicSubfoldersStatic;
    /**
     * @private
     * @type {string}
     */
    private _buildPath;
    /**
     * @private
     * @type {string}
     */
    private _buildAttrIdentifier;
    /**
     * @public
     * @type {string}
     */
    public _buildPrefix: string;
    /**
     * @private
     * @type {boolean}
     */
    private _disableIndent;
    /**
     * @public
     * @type {[string,string,string]}
     */
    public _separator: [string, string, string];
    /**
     * @private
     * @type {resolverType}
     */
    private _renameAttribute;
    /**
     * @private
     * @type {Record<string,(clossingRules)>}
     */
    private _openingClosingTagsRules;
    /**
     * @private
     * @type {Record<string,string>}
     */
    private _replacesFilenameWith;
    /**
     * @private
     * @type {filterType[]}
     */
    private _replaceStringWith;
    /**
     * @private
     * @type {voidElementTagsType}
     */
    private _voidElementTags;
    /**
     * @private
     * @type {string}
     */
    private watchPath;
    /**
     * @private
     * @type {string}
     */
    private instuctionClassesPath;
    /**
     * @private
     */
    private queueHandler;
    /**
     * @private
     * @readonly
     * @type {string}
     */
    private readonly basePath;
    /**
     * @private
     * @returns {resolverType}
     */
    private renameAttribute;
    /**
     * @returns {string}
     */
    uncommentIdentifier: () => string;
    /**
     * @returns {voidElementTagsType}
     */
    voidElementTags: () => voidElementTagsType;
    /**
     * @private
     * @returns {filterType[]|[]}
     */
    private indentFilter;
    /**
     * @returns {filterType[]}
     */
    filter: () => filterType[];
    /**
     * @private
     * @returns {Record<string,(clossingRules)>}
     */
    private openingClosingTagsRules;
    /**
     * @param {number} index
     */
    instruction: (index: number) => string;
    /**
     * @private
     * @type {string[]}
     */
    private extentions;
    /**
     * @private
     * @readonly
     * @type {string}
     */
    private readonly contentRegex;
    /**
     * @param {string} filePath
     * @returns {clossingRules}
     */
    exportIdentifier: (filePath: string) => clossingRules;
    /**
     * @private
     * @readonly
     */
    private readonly colors;
    /**
     * @private
     * @param {string} text
     * @returns {string}
     */
    private colorize;
    /**
     * @typedef {{path:string,callback:()=>Promise<void>}} pathCallbackType
     */
    /**
     * @param {...pathCallbackType} [pathCallback]
     */
    run: (...pathCallback?: {
        path: string;
        callback: () => Promise<void>;
    }[]) => void;
    /**
     * @private
     * @param {string} source
     * @param {string} target
     */
    private copyFile;
    /**
     * @private
     * @param {string} path_
     * @param {boolean} isChange
     * @param {...pathCallbackType} pathCallback
     */
    private handlePathQueued;
    /**
     * @private
     * @param {string} path_
     * @param {boolean} isChange
     * @param {...pathCallbackType} pathCallback
     */
    private handlePath;
}
export type clossingRules = [openTag: string, closeTag: string];
export type filterType = [string | RegExp, string];
export type voidElementTagsType = string[];
export type resolverType = Record<string, Record<string, string>>;
