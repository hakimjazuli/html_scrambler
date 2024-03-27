// @ts-check
import { JSDOM } from 'jsdom';
import fs, { mkdir } from 'fs';
import path from 'path';
import { b_build } from './utils/b_build.mjs';
import { h_build_watcher } from './h_build_watcher.mjs';

/**
 * @typedef {null|Object.<string,([open_tag:string,close_tag:string])>} rename_rules
 */

export class builder {
	/** @type {Document} document */
	document;
	/**
	 * @type {Element|HTMLElement} element
	 */
	element;
	/**
	 * @type {string}
	 */
	base_path;
	/**
	 * @type {b_build}
	 */
	b_build;
	/**
	 * @public
	 * @type {string}
	 */
	new_relative;
	/**
	 * @private
	 * @type {Array<[search:(string|RegExp),replace:string]>}
	 */
	additional_filter;
	/**
	 * @private
	 * @type {[tag_name:string]|[]}
	 */
	void_elements_tag;
	/**
	 * @typedef re_name
	 * @property {string} search search this string from the filename
	 * @property {string} replace replace with this value
	 */
	/**
	 * @private
	 *  @type {re_name}
	 */
	re_name;
	/**
	 * @private
	 * @type {rename_rules}
	 */
	opening_closing_tag_rules;
	/**
	 * @public
	 * @type {null|[delimiter_2:string,delimiter_3:string]}
	 */
	delimiters;
	/** @type {string} */
	watch_path;
	/** @type {string} */
	classes_path;
	/**
	 * @typedef build_options
	 * @property {string} main_static_path
	 * your server static path
	 * @property {string} classes_path
	 * path for your classes to be invoked
	 * @property {string} watch_path
	 * - watch path for changes
	 * - your static site Generator's build path
	 * @property {string} build_path
	 * save all generated html to folder, no need for trailing slashes
	 * @property {re_name} re_name
	 * @property {boolean} [disable_indents] disable indents on the exported file
	 * - false default;
	 * @property {Array<[search:(string|RegExp),replace:string]>} [additional_filter] additional convert array for
	 * - htmlspecialchars
	 * @property {[tag_name:string]|[]} [void_elements_tag]
	 * @property {null|Object.<string,([open_tag:string,close_tag:string])>} [opening_closing_tag_rules]
	 * - detect whether filename include key string, then overwrite opening and closing tag of the exported file;
	 * @property {null|[delimiter_2:string,delimiter_3:string]} [delimiter]
	 */
	/**
	 * Description
	 * @param {build_options} options
	 */
	constructor(options) {
		const {
			// @ts-ignore
			main_static_path,
			// @ts-ignore
			build_path,
			// @ts-ignore
			re_name,
			// @ts-ignore
			classes_path,
			// @ts-ignore
			watch_path,
			// @ts-ignore
			disable_indents = false,
			// @ts-ignore
			additional_filter = [],
			// @ts-ignore
			void_elements_tag = [],
			// @ts-ignore
			opening_closing_tag_rules = null,
			// @ts-ignore
			delimiters = null,
		} = options;
		this.main_static_path = main_static_path;
		this.new_relative = build_path;
		this.re_name = re_name;
		this.disable_indents = disable_indents;
		this.additional_filter = additional_filter;
		this.void_elements_tag = void_elements_tag;
		this.opening_closing_tag_rules = opening_closing_tag_rules;
		this.delimiters = delimiters;
		this.classes_path = classes_path;
		this.watch_path = watch_path;
		this.b_build = new b_build(this);
		this.base_path = this.b_build.input_helpers.get_bases();
	}
	/**
	 * Description
	 * @param {string} string
	 * @param {string} delimiter
	 */
	split = (string, delimiter) => {
		return string
			.split(new RegExp(`(?<!\\\\)${delimiter}`))
			.map((part) => part.replace(/\\/, ''));
	};
	/**
	 * Description
	 * @param {string} watch_path
	 * @returns {Promise<void>}
	 */
	handle_html_all = async (watch_path = this.watch_path) => {
		const html_s = fs.readdirSync(watch_path);
		for (let i = 0; i < html_s.length; i++) {
			const file = html_s[i];
			const file_path = path.join(watch_path, file);
			if (fs.statSync(file_path).isDirectory()) {
				await this.handle_html_all(file_path);
				continue;
			}
			if (file_path.includes('.html')) {
				await this.handle_html(file_path);
			}
		}
		return;
	};
	/**
	 * Description
	 * @public
	 * @param {string} html_path
	 * @returns {Promise<void>}
	 */
	handle_html = async (html_path) => {
		const content = fs.readFileSync(html_path, 'utf8');
		const dom = new JSDOM(content);
		this.document = dom.window.document;
		const selector = this.b_build.build_identifier;
		const build_elements = this.document.querySelectorAll(`[${selector}]`);
		for (let i = build_elements.length - 1; i >= 0; i--) {
			this.element = build_elements[i];
			this.element.removeAttribute(selector);
			await this.per_element();
		}
		const target_path = `${this.base_path}\\${this.new_relative}\\${path.basename(html_path)}`;
		const dir_path = path.dirname(target_path);
		this.handle_save(target_path, dir_path, this.document.documentElement.outerHTML);
		this.classes = {};
		return;
	};
	/**
	 * Description
	 * @private
	 * @param {number} i
	 */
	per_element_attr_selector = (i) => `${this.b_build.build_prefix}${i}`;
	/**
	 * Description
	 * @private
	 * @returns {Promise<void>}
	 */
	per_element = async () => {
		let i = 1;
		let selected = this.per_element_attr_selector(i);
		while (this.element.hasAttribute(selected)) {
			const commands = this.element.getAttribute(selected);
			if (!commands) {
				continue;
			}
			const [class_, method_, ...args] = this.split(
				commands,
				this.b_build.attribute_delimiter
			);
			this.element.removeAttribute(selected);
			if (typeof this.classes[class_] === 'undefined') {
				await this.load_builder_class(class_);
			}
			const element_handler = new this.classes[class_](this);
			await element_handler[method_](...args);
			i++;
			selected = this.per_element_attr_selector(i);
		}
		return;
	};
	classes = {};
	/**
	 * @private
	 * @param {string} class_name
	 */
	load_builder_class = async (class_name) => {
		const class_path = path.join(
			this.base_path,
			this.classes_path ?? this.b_build.default.classes
		);
		const full_path = path.join(class_path, `${class_name}.mjs`);
		try {
			const { [class_name]: ClassObject } = await import(`file://${full_path}`);
			this.classes[class_name] = ClassObject;
		} catch (error) {
			const { [class_name]: ClassObject } = await import(full_path);
			this.classes[class_name] = ClassObject;
		}
	};
	/**
	 * @private
	 * @type {Array<string>}
	 */
	saved = [];
	/**
	 * Description
	 * @private
	 * @param {string} file_path
	 * @param {string} dir_path
	 * @param {string} content
	 */
	handle_save = (file_path, dir_path, content) => {
		if (this.re_name !== null) {
			const { search, replace } = this.re_name;
			file_path = file_path.replace(search, replace);
		}
		const [export_start, export_end] = this.b_build.export_identifier(
			file_path,
			this.opening_closing_tag_rules
		);
		content = this.b_build.input_helpers.close_void_element(content, this.void_elements_tag);
		fs.stat(file_path, (err, stats) => {
			if (err) {
				mkdir(dir_path, { recursive: true }, () => {
					fs.writeFileSync(
						file_path,
						`${export_start}${this.b_build.input_helpers.interpret_special_chars(
							this.b_build.input_helpers.uncomment_document(content),
							{
								disable_indents: this.disable_indents,
								additional_filter: this.additional_filter,
							}
						)}${export_end}`,
						'utf8'
					);
				});
				return;
			}
			if (stats.isFile()) {
				const old_content = fs.readFileSync(file_path, 'utf8');
				const search_export_start = this.b_build.input_helpers.escape_reg_exp(export_start);
				const search_export_end = this.b_build.input_helpers.escape_reg_exp(export_end);
				const regex = new RegExp(
					`${search_export_start}${this.b_build.content_regex}${search_export_end}`,
					'g'
				);
				const new_content = old_content.replace(
					regex,
					`${export_start}${this.b_build.input_helpers.interpret_special_chars(
						this.b_build.input_helpers.uncomment_document(content),
						{
							disable_indents: this.disable_indents,
							additional_filter: this.additional_filter,
						}
					)}${export_end}`
				);
				fs.writeFileSync(file_path, new_content, 'utf8');
			}
		});
	};
	/**
	 * @private
	 */
	class_attribute_resolver = () => {
		let class_;
		while ((class_ = this.element.querySelector('[class]'))) {
			class_.setAttribute('className', class_.getAttribute('class') ?? '');
			class_.removeAttribute('class');
		}
	};
	/**
	 * Description
	 * @param {string} file_path
	 * @param {()=>Promise<boolean>} callback
	 * return boolan whether to use only innerHTML (or outerHTML)
	 * - false default;
	 * - true: save only innerHTML of the element to filepath
	 */
	save_to = async (file_path, callback) => {
		if (this.saved.includes(file_path)) {
			return;
		}
		const only_inner = await callback();
		file_path = `${this.base_path}\\${this.new_relative}\\${file_path}`;
		const dir_path = path.dirname(file_path);
		let content = '';
		if (only_inner) {
			switch (true) {
				case file_path.endsWith('.jsx'):
				case file_path.endsWith('.tsx'):
					this.class_attribute_resolver();
					break;
			}
			content = this.element.innerHTML;
		} else {
			switch (true) {
				case file_path.endsWith('.jsx'):
				case file_path.endsWith('.tsx'):
					if (this.element.hasAttribute('class')) {
						this.element.setAttribute(
							'className',
							this.element.getAttribute('class') ?? ''
						);
						this.element.removeAttribute('class');
						this.class_attribute_resolver();
					}
					break;
			}
			content = this.element.outerHTML;
		}
		this.handle_save(file_path, dir_path, content);
	};
	watch = () => {
		const watcher = new h_build_watcher(this);
		watcher.run();
	};
}
