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
     * @type {HTMLScrambler}
     */
    static __: HTMLScrambler;
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
     * @type {Record<string, import('./Builder.mjs').Builder>}
     */
    static instances: Record<string, import("./Builder.mjs").Builder>;
    /**
     * @param {string} watchPath
     * @returns {Promise<void>}
     */
    static handleHtmlAll: (watchPath: string) => Promise<void>;
    /**
     * @public
     * @param {string} htmlPath
     * @returns {Promise<void>}
     */
    public static handleHtml: (htmlPath: string) => Promise<void>;
    /**
     * split with escapeString `/`
     * @param {string} string
     * @param {string} delimiter
     */
    static splitX: (string: string, delimiter: string) => string[];
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
     * @param {string} fullPathNoExt
     * @param {string} ext
     */
    static classesExist: (fullPathNoExt: string, ext: string) => Promise<boolean>;
    /**
     * @private
     * @param {string} filePath
     * @param {string} dirPath
     * @param {string} content
     */
    private static handleSave;
    /**
     * @param {HTMLElement|Element} element
     * @param {string} newAttributeName
     * @param {string} attribute
     */
    static attributeResolverSingle: (element: HTMLElement | Element, newAttributeName: string, attribute: string) => void;
    /**
     * @private
     * @param {string} filePath
     * @param {boolean} [checkElementAttribute]
     */
    private static attributeResolver;
    /**
     * @param {string} filePath
     * @param {()=>Promise<boolean>} asyncCallback
     * return boolan whether to use only innerHTML (or outerHTML)
     * - false default;
     * - true: save only innerHTML of the element to filepath
     */
    static saveTo: (filePath: string, asyncCallback: () => Promise<boolean>) => Promise<void>;
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
     * @type {string}
     */
    _htmlWatchPath: string;
    /**
     * @type {string}
     */
    _builderClassInstanceFolderPath: string;
    /**
     * @type {string}
     */
    _publicRootStatic: string;
    /**
     * @type {string}
     */
    _publicSubfoldersStatic: string;
    /**
     * @type {string}
     */
    _buildPath: string;
    /**
     * @type {string}
     */
    _buildAttrIdentifier: string;
    /**
     * @type {string}
     */
    _buildPrefix: string;
    /**
     * @type {boolean}
     */
    _disableIndent: boolean;
    /**
     * @type {[string,string,string]}
     */
    _separator: [string, string, string];
    /**
     * @type {resolverType}
     */
    _renameAttribute: resolverType;
    /**
     * @type {Record<string,(clossingRules)>}
     */
    _openingClosingTagsRules: Record<string, (clossingRules)>;
    /**
     * @type {Record<string,string>}
     */
    _replacesFilenameWith: Record<string, string>;
    /**
     * @type {filterType[]}
     */
    _replaceStringWith: filterType[];
    /**
     * @type {voidElementTagsType}
     */
    _voidElementTags: voidElementTagsType;
    /**
     * @type {string}
     */
    watchPath: string;
    /**
     * @type {string}
     */
    instuctionClassesPath: string;
    /**
     * @readonly
     * @type {string}
     */
    readonly basePath: string;
    /**
     * @returns {resolverType}
     */
    renameAttribute: () => resolverType;
    /**
     * @returns {string}
     */
    uncommentIdentifier: () => string;
    /**
     * @returns {voidElementTagsType}
     */
    voidElementTags: () => voidElementTagsType;
    /**
     * @returns {filterType[]|[]}
     */
    indentFilter: () => filterType[] | [];
    /**
     * @returns {filterType[]}
     */
    filter: () => filterType[];
    /**
     * @returns {Record<string,(clossingRules)>}
     */
    openingClosingTagsRules: () => Record<string, (clossingRules)>;
    /**
     * @param {number} index
     */
    instruction: (index: number) => string;
    /**
     * @type {string[]}
     */
    extentions: string[];
    /**
     * @readonly
     * @type {string}
     */
    readonly contentRegex: string;
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
     * @param {string} text
     * @returns {string}
     */
    colorize: (text: string) => string;
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
    private handlePath;
}
export type clossingRules = [openTag: string, closeTag: string];
export type filterType = [string | RegExp, string];
export type voidElementTagsType = string[];
export type resolverType = Record<string, Record<string, string>>;
