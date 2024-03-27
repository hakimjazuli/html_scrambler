// @ts-check
import { h_builder } from './h_builder.mjs';

/**
 * HOW TO CALL from html
 * use attribute:
 * - build, with conjunction of
 * - b-index_number="class_name;method_name;...arguments";
 * -- use this.builder.split, to split arguments using this.builder.b_build.attribute_delimiter variant as argument
 *
 * reference on active document
 * - this.builder.document is curent document;
 * - this.builder.element is curent element;
 */
export class builder_class {
	/**
	 * Description
	 * @param {h_builder} h_builder
	 */
	constructor(h_builder) {
		this.h_builder = h_builder;
	}
	/**
	 * Description
	 * @param {string} element_string
	 * @param {boolean} [only_inner]
	 */
	replace_with = (element_string, only_inner = false) => {
		if (only_inner) {
			this.h_builder.element.innerHTML = element_string;
			return;
		}
		this.start_with(element_string, only_inner);
		this.h_builder.element.remove();
	};
	/**
	 * Description
	 * @param {string} argument_open
	 * @param {string} argument_close
	 * @param {boolean} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	surround_with = (argument_open, argument_close, use_inner = false) => {
		const text_before = this.h_builder.document.createTextNode(argument_open);
		const text_after = this.h_builder.document.createTextNode(argument_close);
		if (use_inner) {
			const parent_node = this.h_builder.element;
			const elem = this.h_builder.element.childNodes[0];
			parent_node.insertBefore(text_before, elem);
			parent_node.insertBefore(text_after, elem.nextSibling);
			return;
		}
		const parent_node = this.h_builder.element.parentNode;
		if (!parent_node) {
			return;
		}
		parent_node.insertBefore(text_before, this.h_builder.element);
		parent_node.insertBefore(text_after, this.h_builder.element.nextSibling);
	};
	/**
	 * Description
	 * @param {string} open_arguments
	 * @param {boolean} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	start_with = (open_arguments, use_inner = false) => {
		const text_before = this.h_builder.document.createTextNode(open_arguments);
		if (use_inner) {
			const parent_node = this.h_builder.element;
			const elem = this.h_builder.element.childNodes[0];
			parent_node.insertBefore(text_before, elem);
			return;
		}
		const parent_node = this.h_builder.element.parentNode;
		if (!parent_node) {
			return;
		}
		parent_node.insertBefore(text_before, this.h_builder.element);
	};
	/**
	 * Description
	 * @param {string} close_argument
	 * @param {boolean} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	end_with = (close_argument, use_inner = false) => {
		const text_after = this.h_builder.document.createTextNode(close_argument);
		if (use_inner) {
			const parent_node = this.h_builder.element;
			const elem = this.h_builder.element.childNodes[0];
			parent_node.insertBefore(text_after, elem.nextSibling);
			return;
		}
		const parent_node = this.h_builder.element.parentNode;
		if (!parent_node) {
			return;
		}
		parent_node.insertBefore(text_after, this.h_builder.element.nextSibling);
	};
}
