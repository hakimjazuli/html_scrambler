// @ts-check

import { join as pathJoin, dirname as pathDirname } from 'path';
import fs from 'fs';
import process from 'process';
import chokidar from 'chokidar';
import path from 'path';
import domino from 'domino';
import { stringHelpers } from './stringHelpers.mjs';
import { _Queue, _QueueObject } from '@html_first/simple_queue';

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
	static __;
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
	constructor({
		_htmlWatchPath = 'builder/html_first/src',
		_builderClassInstanceFolderPath = 'builder/html_first/classes',
		_publicRootStatic = 'public',
		_publicSubfoldersStatic = 'public',
		_buildPath = 'builder/html_first/result',
		_buildAttrIdentifier = 'build',
		_buildPrefix = 'b-',
		_disableIndent = false,
		_separator = [';', ':', ','],
		_renameAttribute = {},
		_openingClosingTagsRules = {},
		_replacesFilenameWith = {},
		_replaceStringWith = [],
		_voidElementTags = [],
	}) {
		if (HTMLScrambler.__ instanceof HTMLScrambler) {
			return;
		}
		HTMLScrambler.__ = this;
		this._htmlWatchPath = _htmlWatchPath;
		this._builderClassInstanceFolderPath = _builderClassInstanceFolderPath;
		this._publicRootStatic = _publicRootStatic;
		this._publicSubfoldersStatic = _publicSubfoldersStatic;
		this._buildPath = _buildPath;
		this._buildAttrIdentifier = _buildAttrIdentifier;
		this._buildPrefix = _buildPrefix;
		this._disableIndent = _disableIndent;
		this._separator = _separator;
		this._renameAttribute = _renameAttribute;
		this._openingClosingTagsRules = _openingClosingTagsRules;
		this._replacesFilenameWith = _replacesFilenameWith;
		this._replaceStringWith = _replaceStringWith;
		this._voidElementTags = _voidElementTags;
		this.watchPath = pathJoin(this.basePath, _htmlWatchPath);
		this.instuctionClassesPath = pathJoin(this.basePath, _builderClassInstanceFolderPath);
	}
	queueHandler = new _Queue();
	/**
	 * @type {Document}
	 */
	static document;
	/**
	 * @type {Element|HTMLElement}
	 */
	static element;
	/**
	 * @type {number}
	 */
	static index;
	/**
	 * @type {Record<string, import('./Builder.mjs').Builder>}
	 */
	static instances = {};
	/**
	 * @type {string}
	 */
	_htmlWatchPath;
	/**
	 * @type {string}
	 */
	_builderClassInstanceFolderPath;
	/**
	 * @type {string}
	 */
	_publicSubfoldersStatic;
	/**
	 * @type {string}
	 */
	_publicRootStatic;
	/**
	 * @type {string}
	 */
	_buildPath;
	/**
	 * @type {boolean}
	 */
	_disableIndent;
	/**
	 * @type {resolverType}
	 */
	_renameAttribute;
	/**
	 * @type {string}
	 */
	_buildAttrIdentifier;
	/**
	 * @type {string}
	 */
	_buildPrefix;
	/**
	 * @type {[string,string,string]}
	 */
	_separator;
	/**
	 * @type {Record<string,(clossingRules)>}
	 */
	_openingClosingTagsRules;
	/**
	 * @type {voidElementTagsType}
	 */
	_voidElementTags;
	/**
	 * @type {filterType[]}
	 */
	_replaceStringWith;
	/**
	 * @type {Record<string,string>}
	 */
	_replacesFilenameWith;
	/**
	 * @readonly
	 * @type {string}
	 */
	basePath = process.cwd();
	/**
	 * @returns {resolverType}
	 */
	renameAttribute = () => {
		return Object.assign(this._renameAttribute, {
			jsx: { class: 'className' },
			tsx: { class: 'className' },
		});
	};
	/**
	 * @returns {string}
	 */
	uncommentIdentifier = () => `${this._buildPrefix}attr`;
	/**
	 * @returns {voidElementTagsType}
	 */
	voidElementTags = () => {
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
		].concat(this._voidElementTags);
	};
	/**
	 * @returns {filterType[]|[]}
	 */
	indentFilter = () => {
		if (this._disableIndent) {
			return [[/^[\s]+| {2,}/gm, '']];
		}
		return [];
	};
	/**
	 * @returns {filterType[]}
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
				/** reprocessing `interpretSpecialChars` with document.outerHTML will break things(in this case the uncommented b-attr), therefor this array and after is needed; */
				/\s*(.*?)\s*=""/g,
				' $1',
			],
			[/<\?="(.*?)\?">/g, '<?= $1 ?>'],
			...this._replaceStringWith,
			...this.indentFilter(),
		];
	};
	/**
	 * @returns {Record<string,(clossingRules)>}
	 */
	openingClosingTagsRules = () => {
		return Object.assign(this._openingClosingTagsRules, {
			jsx: ['{/* b-build: start */}', '{/* b-build: end */}'],
			tsx: ['{/* b-build: start */}', '{/* b-build: end */}'],
			templ: ['// b-build: start/n', '// b-build: end/n'],
			default: ['<!-- b-build: start -->', '<!-- b-build: end -->'],
		});
	};
	/**
	 * @param {number} index
	 */
	instruction = (index) => `${this._buildPrefix}${index}`;
	/**
	 * @type {string[]}
	 */
	extentions = [
		'mjs',
		// /** temporary drop js and ts support */ 'js',
		// 'ts' /** temporary drop js and ts support */,
	];
	/**
	 * @readonly
	 * @type {string}
	 */
	contentRegex = '([\\s\\S]*?)';
	/**
	 * @param {string} filePath
	 * @returns {clossingRules}
	 */
	exportIdentifier = (filePath) => {
		const closingTags = this.openingClosingTagsRules();
		if (filePath in closingTags) {
			return closingTags[filePath];
		} else {
			return closingTags.default;
		}
	};
	/**
	 * @private
	 * @readonly
	 */
	colors = {
		reset: '\x1b[0m',
		warning: '\x1b[32m',
	};
	/**
	 * @param {string} text
	 * @returns {string}
	 */
	colorize = (text) => {
		return `${this.colors.warning}${text}${this.colors.reset}`;
	};
	/**
	 * @type {string}
	 */
	watchPath;
	/**
	 * @type {string}
	 */
	instuctionClassesPath;
	/**
	 * @typedef {{path:string,callback:()=>Promise<void>}} pathCallbackType
	 */
	/**
	 * @param {...pathCallbackType} [pathCallback]
	 */
	run = (...pathCallback) => {
		const paths = [this.watchPath, this.instuctionClassesPath];
		if (pathCallback) {
			for (let i = 0; i < pathCallback.length; i++) {
				const { path: path_, callback } = pathCallback[i];
				const path__ = pathJoin(this.basePath, path_);
				pathCallback[i] = { path: path__, callback };
				paths.push(path__);
			}
		}
		const watcher = chokidar.watch(paths, {
			ignored: /[\/\\]\./,
			persistent: true,
		});
		watcher
			.on('add', async (path) => {
				this.handlePathQueued(path, false, ...pathCallback);
			})
			.on('change', async (path) => {
				this.handlePathQueued(path, true, ...pathCallback);
			});
		process.on('exit', (code) => {
			console.log('Exiting...');
			watcher.close();
		});
		process.on('SIGINT', () => {
			console.log('Received SIGINT. Exiting...');
			process.exit(0);
		});
		console.info(`\nstarts watching: "${this.basePath}"\n`, 'Press Ctrl+C to exit.');
	};
	/**
	 * @private
	 * @param {string} source
	 * @param {string} target
	 */
	copyFile = (source, target) => {
		const targetDir = pathDirname(target);
		fs.mkdir(targetDir, { recursive: true }, (err) => {
			fs.copyFileSync(source, target);
			console.info(`copy file from: "${source}" to: "${target}"`);
		});
	};
	/**
	 * @private
	 * @param {string} path_
	 * @param {boolean} isChange
	 * @param {...pathCallbackType} pathCallback
	 */
	handlePathQueued = (path_, isChange, ...pathCallback) => {
		this.queueHandler.assign(
			new _QueueObject(
				path_,
				async () => {
					await this.handlePath(path_, isChange, ...pathCallback);
				},
				300
			)
		);
	};
	/**
	 * @private
	 * @param {string} path_
	 * @param {boolean} isChange
	 * @param {...pathCallbackType} pathCallback
	 */
	handlePath = async (path_, isChange, ...pathCallback) => {
		if (pathCallback) {
			for (let i = 0; i < pathCallback.length; i++) {
				const { path: path__, callback } = pathCallback[i];
				if (path_.startsWith(path__)) {
					await callback();
					console.info(`render ${this.colorize('custom run')} for ${path_}`);
					return;
				}
			}
		}
		const watchPath = this.watchPath;
		if (!path_.startsWith(watchPath)) {
			if (isChange) {
				HTMLScrambler.instances = {};
				await HTMLScrambler.handleHtmlAll(watchPath);
				console.info(`render build for ${this.colorize('ALL OF')} "${watchPath}/*.html"`);
				return;
			}
		} else if (!path_.endsWith('.html')) {
			const inAFolder = path_.replace(`${watchPath}\\`, '').includes('\\');
			let sendTo = '';
			if (inAFolder) {
				sendTo = pathJoin(this.basePath, this._publicSubfoldersStatic);
			} else {
				sendTo = pathJoin(this.basePath, this._publicRootStatic);
			}
			this.copyFile(path_, path_.replace(watchPath, sendTo));
			return;
		} else {
			await HTMLScrambler.handleHtml(path_);
			console.info(`render build for ${this.colorize('SINGLE')} "${path_}"`);
		}
	};
	/**
	 * @param {string} watchPath
	 * @returns {Promise<void>}
	 */
	static handleHtmlAll = async (watchPath) => {
		const htmlS = fs.readdirSync(watchPath);
		for (let i = 0; i < htmlS.length; i++) {
			const file = htmlS[i];
			const filePath = path.join(watchPath, file);
			if (fs.statSync(filePath).isDirectory()) {
				await this.handleHtmlAll(filePath);
				continue;
			}
			if (filePath.includes('.html')) {
				await this.handleHtml(filePath);
			}
		}
		return;
	};
	/**
	 * @public
	 * @param {string} htmlPath
	 * @returns {Promise<void>}
	 */
	static handleHtml = async (htmlPath) => {
		const content = fs.readFileSync(htmlPath, 'utf-8');
		this.document = domino.createDocument(content, true);
		const selector = HTMLScrambler.__._buildAttrIdentifier;
		const buildElements = this.document.querySelectorAll(`[${selector}]`);
		for (let i = buildElements.length - 1; i >= 0; i--) {
			this.element = buildElements[i];
			this.element.removeAttribute(selector);
			await this.perElement();
		}
		const targetPath = path.join(
			HTMLScrambler.__.basePath,
			HTMLScrambler.__._buildPath,
			path.basename(htmlPath)
		);
		const dirPath = path.dirname(targetPath);
		this.handleSave(targetPath, dirPath, this.document.documentElement.outerHTML);
		return;
	};
	/**
	 * split with escapeString `/`
	 * @param {string} string
	 * @param {string} delimiter
	 */
	static splitX = (string, delimiter) => {
		return string
			.split(new RegExp(`(?<!\\\\)${delimiter}`))
			.map((part) => part.replace(/\\/, ''));
	};
	/**
	 * @private
	 * @returns {Promise<void>}
	 */
	static perElement = async () => {
		this.index = 1;
		let selected = HTMLScrambler.__.instruction(this.index);
		while (this.element.hasAttribute(selected)) {
			const commands = this.element.getAttribute(selected);
			if (!commands) {
				continue;
			}
			const [class_, method_, ...args] = this.splitX(
				commands,
				HTMLScrambler.__._separator[0]
			);
			this.element.removeAttribute(selected);
			try {
				if (typeof this.instances[class_] === 'undefined') {
					await this.loadBuilderClass(class_);
				}
				const elementHandler = this.instances[class_];
				if (!(method_ in elementHandler)) {
					throw Error(`method "${method_}" doesn't exist in class "${class_}"`);
				}
				await elementHandler[method_](...args);
			} catch (error) {
				console.log({
					error,
					instruction: {
						class: class_,
						method: method_,
						arguments: [...args],
					},
				});
			}
			this.index++;
			selected = HTMLScrambler.__.instruction(this.index);
		}
		return;
	};
	/**
	 * @private
	 * @param {string} className
	 */
	static loadBuilderClass = async (className) => {
		const fullPathNoExt = path.join(HTMLScrambler.__.instuctionClassesPath, `${className}`);
		/**
		 * @type {null|string}
		 */
		let fullPath = null;
		const exts = HTMLScrambler.__.extentions;
		for (let i = 0; i < exts.length; i++) {
			if (await this.classesExist(fullPathNoExt, exts[i])) {
				fullPath = `${fullPathNoExt}.${exts[i]}`;
				break;
			}
		}
		if (!fullPath) {
			return;
		}
		try {
			const { default: ClassObject } = await import(`file://${fullPath}`);
			this.instances[className] = new ClassObject();
		} catch (error) {
			const { default: ClassObject } = await import(fullPath);
			this.instances[className] = new ClassObject();
		}
	};
	/**
	 * @param {string} fullPathNoExt
	 * @param {string} ext
	 */
	static classesExist = async (fullPathNoExt, ext) => fs.existsSync(`${fullPathNoExt}.${ext}`);
	/**
	 * @private
	 * @param {string} filePath
	 * @param {string} dirPath
	 * @param {string} content
	 */
	static handleSave = (filePath, dirPath, content) => {
		for (const originalFileName in HTMLScrambler.__._replacesFilenameWith) {
			const replaceWith = HTMLScrambler.__._replacesFilenameWith[originalFileName];
			filePath = filePath.replace(originalFileName, replaceWith);
		}
		const [exportStart, exportEnd] = HTMLScrambler.__.exportIdentifier(filePath);
		content = stringHelpers.closeVoidElement(content);
		fs.stat(filePath, (err, stats) => {
			if (err) {
				fs.mkdirSync(dirPath, { recursive: true });
				fs.writeFileSync(
					filePath,
					`${exportStart} ${stringHelpers.interpretSpecialChars(
						stringHelpers.uncommentDocument(content)
					)} ${exportEnd}`,
					'utf8'
				);
				return;
			}
			if (stats.isFile()) {
				const oldContent = fs.readFileSync(filePath, 'utf8');
				const searchExportStart = stringHelpers.escapeRegExp(exportStart);
				const searchExportEnd = stringHelpers.escapeRegExp(exportEnd);
				const regex = new RegExp(
					`${searchExportStart}${HTMLScrambler.__.contentRegex}${searchExportEnd}`,
					'g'
				);
				const newContent = oldContent.replace(
					regex,
					`${exportStart} ${stringHelpers.interpretSpecialChars(
						stringHelpers.uncommentDocument(content)
					)} ${exportEnd}`
				);
				fs.writeFileSync(filePath, newContent, 'utf8');
			}
		});
	};
	/**
	 * @param {HTMLElement|Element} element
	 * @param {string} newAttributeName
	 * @param {string} attribute
	 */
	static attributeResolverSingle = (element, newAttributeName, attribute) => {
		element.setAttribute(newAttributeName, element.getAttribute(attribute) ?? '');
		element.removeAttribute(attribute);
	};
	/**
	 * @private
	 * @param {string} filePath
	 * @param {boolean} [checkElementAttribute]
	 */
	static attributeResolver = (filePath, checkElementAttribute = false) => {
		let class_;
		const attributeResolver = HTMLScrambler.__.renameAttribute();
		for (const extention in attributeResolver) {
			if (filePath.includes(extention)) {
				const handler = attributeResolver[extention];
				for (const attribute in handler) {
					const newAttributeName = handler[attribute];
					if (checkElementAttribute) {
						this.attributeResolverSingle(this.element, newAttributeName, attribute);
					}
					while ((class_ = this.element.querySelector(`[${attribute}]`))) {
						this.attributeResolverSingle(class_, newAttributeName, attribute);
					}
				}
			}
		}
	};
	/**
	 * @param {string} filePath
	 * @param {()=>Promise<boolean>} asyncCallback
	 * return boolan whether to use only innerHTML (or outerHTML)
	 * - false default;
	 * - true: save only innerHTML of the element to filepath
	 */
	static saveTo = async (filePath, asyncCallback) => {
		const onlyInner = await asyncCallback();
		filePath = path.join(HTMLScrambler.__.basePath, HTMLScrambler.__._buildPath, filePath);
		const dirPath = path.dirname(filePath);
		let content = '';
		if (onlyInner) {
			this.attributeResolver(filePath);
			content = this.element.innerHTML;
		} else {
			this.attributeResolver(filePath, true);
			content = this.element.outerHTML;
		}
		this.handleSave(filePath, dirPath, content);
	};
}
