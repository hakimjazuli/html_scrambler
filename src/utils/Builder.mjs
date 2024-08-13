// @ts-check

import fs from 'fs';
import path from 'path';
import domino from 'domino';
import { __Watcher } from './__Watcher.mjs';
import { __AppSettings } from '../vars/__AppSettings.mjs';
import { __StringHelpers } from './__StringHelpers.mjs';

export class Builder {
	/** @type {Document} document */
	document;
	/**
	 * @type {Element|HTMLElement} element
	 */
	element;
	/** @type {number} */
	index;
	/** @type {Object.<string,typeof import('./_BuilderClass.mjs')._BuilderClass>} */
	classes = {};
	/**
	 * @param {string} string
	 * @param {string} delimiter
	 */
	split = (string, delimiter) => {
		return string
			.split(new RegExp(`(?<!\\\\)${delimiter}`))
			.map((part) => part.replace(/\\/, ''));
	};
	/**
	 * @param {string|null} watch_path
	 * @returns {Promise<void>}
	 */
	handle_html_all = async (watch_path = null) => {
		watch_path = watch_path ?? __Watcher.__.watch_path;
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
	 * @public
	 * @param {string} html_path
	 * @returns {Promise<void>}
	 */
	handle_html = async (html_path) => {
		const content = fs.readFileSync(html_path, 'utf-8');
		this.document = domino.createDocument(content, true);
		const selector = __AppSettings.__._build_identifier;
		const build_elements = this.document.querySelectorAll(`[${selector}]`);
		for (let i = build_elements.length - 1; i >= 0; i--) {
			this.element = build_elements[i];
			this.element.removeAttribute(selector);
			await this.per_element();
		}
		const target_path = path.join(
			__Watcher.__.base_path,
			__AppSettings.__._build_path,
			path.basename(html_path)
		);
		const dir_path = path.dirname(target_path);
		this.handle_save(target_path, dir_path, this.document.documentElement.outerHTML);
		return;
	};
	/**
	 * @private
	 * @returns {Promise<void>}
	 */
	per_element = async () => {
		this.index = 1;
		const __app_settings = __AppSettings.__;
		let selected = __app_settings.instruction(this.index);
		while (this.element.hasAttribute(selected)) {
			const commands = this.element.getAttribute(selected);
			if (!commands) {
				continue;
			}
			const [class_, method_, ...args] = this.split(commands, __app_settings._separator[0]);
			this.element.removeAttribute(selected);
			try {
				if (typeof this.classes[class_] === 'undefined') {
					await this.load_builder_class(class_);
				}
				const element_handler = new this.classes[class_](this);
				await element_handler[method_](...args);
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
			selected = __app_settings.instruction(this.index);
		}
		return;
	};
	/**
	 * @param {string} full_path_no_ext
	 * @param {string} ext
	 */
	classes_exist = async (full_path_no_ext, ext) => fs.existsSync(`${full_path_no_ext}.${ext}`);
	/**
	 * @private
	 * @param {string} class_name
	 */
	load_builder_class = async (class_name) => {
		const __app_settings = __AppSettings.__;
		const full_path_no_ext = path.join(__Watcher.__.instuction_classes_path, `${class_name}`);
		/**
		 * @type {null|string}
		 */
		let full_path = null;
		const exts = __app_settings.extentions;
		for (let i = 0; i < exts.length; i++) {
			if (await this.classes_exist(full_path_no_ext, exts[i])) {
				full_path = `${full_path_no_ext}.${exts[i]}`;
				break;
			}
		}
		if (!full_path) {
			return;
		}
		try {
			const { default: ClassObject } = await import(`file://${full_path}`);
			this.classes[class_name] = ClassObject;
		} catch (error) {
			const { default: ClassObject } = await import(full_path);
			this.classes[class_name] = ClassObject;
		}
	};
	/**
	 * @private
	 * @param {string} file_path
	 * @param {string} dir_path
	 * @param {string} content
	 */
	handle_save = (file_path, dir_path, content) => {
		const __app_settings = __AppSettings.__;
		for (const original_file_name in __app_settings._replaces_filename_with) {
			const replace_with = __app_settings._replaces_filename_with[original_file_name];
			file_path = file_path.replace(original_file_name, replace_with);
		}
		const [export_start, export_end] = __app_settings.export_identifier(file_path);
		content = __StringHelpers.__.close_void_element(content);
		fs.stat(file_path, (err, stats) => {
			if (err) {
				fs.mkdirSync(dir_path, { recursive: true });
				fs.writeFileSync(
					file_path,
					`${export_start} ${__StringHelpers.__.interpret_special_chars(
						__StringHelpers.__.uncomment_document(content)
					)} ${export_end}`,
					'utf8'
				);
				return;
			}
			if (stats.isFile()) {
				const old_content = fs.readFileSync(file_path, 'utf8');
				const search_export_start = __StringHelpers.__.escape_reg_exp(export_start);
				const search_export_end = __StringHelpers.__.escape_reg_exp(export_end);
				const regex = new RegExp(
					`${search_export_start}${__app_settings.content_regex}${search_export_end}`,
					'g'
				);
				const new_content = old_content.replace(
					regex,
					`${export_start} ${__StringHelpers.__.interpret_special_chars(
						__StringHelpers.__.uncomment_document(content)
					)} ${export_end}`
				);
				fs.writeFileSync(file_path, new_content, 'utf8');
			}
		});
	};
	/**
	 * @param {HTMLElement|Element} element
	 * @param {string} new_attribute_name
	 * @param {string} attribute
	 */
	attribute_resolver_single = (element, new_attribute_name, attribute) => {
		element.setAttribute(new_attribute_name, element.getAttribute(attribute) ?? '');
		element.removeAttribute(attribute);
	};
	/**
	 * @private
	 * @param {string} file_path
	 * @param {boolean} [check_element_attribute]
	 */
	attribute_resolver = (file_path, check_element_attribute = false) => {
		let class_;
		const attribute_resolver = __AppSettings.__.attribute_resolver();
		for (const extention in attribute_resolver) {
			if (file_path.includes(extention)) {
				const handler = attribute_resolver[extention];
				for (const attribute in handler) {
					const new_attribute_name = handler[attribute];
					if (check_element_attribute) {
						this.attribute_resolver_single(this.element, new_attribute_name, attribute);
					}
					while ((class_ = this.element.querySelector(`[${attribute}]`))) {
						this.attribute_resolver_single(class_, new_attribute_name, attribute);
					}
				}
			}
		}
	};
	/**
	 * @param {string} file_path
	 * @param {()=>Promise<boolean>} callback
	 * return boolan whether to use only innerHTML (or outerHTML)
	 * - false default;
	 * - true: save only innerHTML of the element to filepath
	 */
	save_to = async (file_path, callback) => {
		const only_inner = await callback();
		file_path = path.join(__Watcher.__.base_path, __AppSettings.__._build_path, file_path);
		const dir_path = path.dirname(file_path);
		let content = '';
		if (only_inner) {
			this.attribute_resolver(file_path);
			content = this.element.innerHTML;
		} else {
			this.attribute_resolver(file_path, true);
			content = this.element.outerHTML;
		}
		this.handle_save(file_path, dir_path, content);
	};
}
