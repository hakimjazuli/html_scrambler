// @ts-check

import { __AppSettings } from '../vars/__AppSettings.mjs';

/** @typedef {import('./Builder.mjs').Builder} Builder*/

export class _BuilderClass {
	/** @type {Builder} */
	builder;
	/** @type {Builder['split']} */
	split;
	/**
	 * @param {Builder} builder
	 */
	constructor(builder) {
		this.builder = builder;
		this.split = builder.split;
	}
	/**

	 * @param {string} element_string
	 * @param {boolean} [only_inner]
	 */
	replace_with = (element_string, only_inner = false) => {
		if (only_inner) {
			this.builder.element.innerHTML = element_string;
			return;
		}
		this.start_with(element_string, only_inner);
		this.builder.element.remove();
	};
	/**

	 * @param {string} argument_open
	 * @param {string} argument_close
	 * @param {false|string} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	surround_with = (argument_open, argument_close, use_inner = false) => {
		const text_before = this.builder.document.createTextNode(argument_open);
		const text_after = this.builder.document.createTextNode(argument_close);
		if (use_inner) {
			const parent_node = this.builder.element;
			const elem = this.builder.element.childNodes[0];
			parent_node.insertBefore(text_before, elem);
			parent_node.insertBefore(text_after, elem.nextSibling);
			return;
		}
		const parent_node = this.builder.element.parentNode;
		if (!parent_node) {
			return;
		}
		parent_node.insertBefore(text_before, this.builder.element);
		parent_node.insertBefore(text_after, this.builder.element.nextSibling);
	};
	/**

	 * @param {string} open_arguments
	 * @param {boolean} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	start_with = (open_arguments, use_inner = false) => {
		const text_before = this.builder.document.createTextNode(open_arguments);
		if (use_inner) {
			const parent_node = this.builder.element;
			const elem = this.builder.element.childNodes[0];
			parent_node.insertBefore(text_before, elem);
			return;
		}
		const parent_node = this.builder.element.parentNode;
		if (!parent_node) {
			return;
		}
		parent_node.insertBefore(text_before, this.builder.element);
	};
	/**

	 * @param {string} close_argument
	 * @param {boolean} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	end_with = (close_argument, use_inner = false) => {
		const text_after = this.builder.document.createTextNode(close_argument);
		if (use_inner) {
			const parent_node = this.builder.element;
			const elem = this.builder.element.childNodes[0];
			parent_node.insertBefore(text_after, elem.nextSibling);
			return;
		}
		const parent_node = this.builder.element.parentNode;
		if (!parent_node) {
			return;
		}
		parent_node.insertBefore(text_after, this.builder.element.nextSibling);
	};
	/**

	 * @param {string} new_tag
	 */
	tag = async (new_tag) => {
		const build_element_attribute = this.builder.element.attributes;
		const new_element = this.builder.document.createElement(new_tag);
		for (var i = 0; i < build_element_attribute.length; i++) {
			const attribute = build_element_attribute[i];
			new_element.setAttribute(attribute.name, attribute.value);
		}
		new_element.innerHTML = this.builder.element.innerHTML;
		const parent_node = this.builder.element.parentNode;
		if (parent_node) {
			parent_node.replaceChild(new_element, this.builder.element);
		}
	};
	/**

	 * @param {string} attribute
	 */
	attr = async (attribute) => {
		const uncomment_identifier = __AppSettings.__.uncomment_identifier();
		let attribute_ = '';
		if (this.builder.element.hasAttribute(__AppSettings.__.uncomment_identifier())) {
			// @ts-ignore
			attribute_ = this.builder.element.getAttribute(uncomment_identifier);
		}
		this.builder.element.setAttribute(
			uncomment_identifier,
			`${attribute_} ${attribute}`.trim()
		);
	};
	/**

	 * @param {string} new_dir
	 * @param {false|string} replace
	 * replace original element (in the parent file) with string
	 */
	partial = (new_dir, replace = false) => {
		this.builder.save_to(new_dir, async () => {
			if (replace !== false) {
				this.replace_with(`${replace}\n`);
				return false;
			}
			return true;
		});
		if (replace !== false) {
			this.builder.element.innerHTML = replace;
		}
	};
	/**
	 * @private
	 * @param {number} index
	 */
	get_current_valid_index = (index) => {
		index++;
		while (this.builder.element.hasAttribute(`${__AppSettings.__._build_prefix}${index}`)) {
			index++;
		}
		return index;
	};
	/**
	 * @protected
	 * @param {string[]} arguments_
	 */
	set_b_next = (...arguments_) => {
		this.builder.element.setAttribute(
			`${__AppSettings.__.instruction(this.get_current_valid_index(this.builder.index))}`,
			arguments_.join(__AppSettings.__._separator[0])
		);
	};
}
