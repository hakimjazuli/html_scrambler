// @ts-check
import domino from 'domino';
import fs, { mkdir } from 'fs';
import path from 'path';
import { b_build } from './b_build.mjs';
import { h_watcher } from './h_watcher.mjs';

/**
 * @typedef h_builder_options
 * @property {string} main_static_path
 * your server static path
 * @property {string} build_path
 * save all generated html to folder, no need for trailing slashes
 * @property {replace} replace
 * upon generating to build_path, replace any main html file using
 * -- "*.html".replace(replace.search, replace.replace);
 * @property {boolean} [disable_indents] disable indents on the exported file
 * - false default;
 * @property {Array<[search:(string|RegExp),replace:string]>} [additional_filter] additional convert array for
 * - htmlspecialchars
 * @property {[tag_name:string]|[]} [void_elements_tag]
 * @property {null|Object.<string,([open_tag:string,close_tag:string])>} [opening_closing_tag_rules]
 * - detect whether filename include key string, then overwrite opening and closing tag of the exported file;
 * @property {null|[delimiter_2:string,delimiter_3:string]} [delimiters]
 */

/**
 * @typedef {null|Object.<string,([open_tag:string,close_tag:string])>} opening_closing_tag_rules
 */
export class h_builder {
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
	 * @private
	 * @type {opening_closing_tag_rules}
	 */
	opening_closing_tag_rules;
	/**
	 * @public
	 * @type {null|[delimiter_2:string,delimiter_3:string]}
	 */
	delimiters;
	/**
	 * @typedef replace
	 * @property {string} search search this string from the filename
	 * @property {string} replace replace with this value
	 */
	/**
	 * @private
	 *  @type {replace}
	 */
	replace;
	/**
	 * @param {h_watcher} h_watcher
	 * @param {h_builder_options} options
	 */
	constructor(
		h_watcher,
		{
			build_path,
			main_static_path,
			replace,
			additional_filter = [],
			delimiters = null,
			disable_indents = false,
			opening_closing_tag_rules = null,
			void_elements_tag = [],
		}
	) {
		this.h_watcher = h_watcher;
		this.main_static_path = main_static_path;
		this.new_relative = build_path;
		this.replace = replace;
		this.disable_indents = disable_indents;
		this.additional_filter = additional_filter;
		this.void_elements_tag = void_elements_tag;
		this.opening_closing_tag_rules = opening_closing_tag_rules;
		this.delimiters = delimiters;
		this.b_build = new b_build(this);
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
	/** @type {Document} document */
	document;
	/**
	 * @type {Element|HTMLElement} element
	 */
	element;
	/**
	 * Description
	 * @param {string|null} watch_path
	 * @returns {Promise<void>}
	 */
	handle_html_all = async (watch_path = null) => {
		watch_path = watch_path ?? this.h_watcher.watch_path;
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
		const content = fs.readFileSync(html_path, 'utf-8');
		this.document = domino.createDocument(content, true);
		const selector = this.b_build.build_identifier;
		const build_elements = this.document.querySelectorAll(`[${selector}]`);
		for (let i = build_elements.length - 1; i >= 0; i--) {
			this.element = build_elements[i];
			this.element.removeAttribute(selector);
			await this.per_element();
		}
		const target_path = path.join(
			this.h_watcher.base_path,
			this.new_relative,
			path.basename(html_path)
		);
		const dir_path = path.dirname(target_path);
		this.handle_save(target_path, dir_path, this.document.documentElement.outerHTML);
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
		const full_path = path.join(
			this.h_watcher.classes_path ?? this.b_build.default.classes,
			`${class_name}.mjs`
		);
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
		if (this.replace !== null) {
			const { search, replace } = this.replace;
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
		file_path = path.join(this.h_watcher.base_path, this.new_relative, file_path);
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
}
