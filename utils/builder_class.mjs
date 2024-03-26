// @ts-check
import { builder } from '../builder.mjs';

export class builder_class {
	/**
	 * Description
	 * @param {builder} builder
	 */
	constructor(builder) {
		this.builder = builder;
	}
	/**
	 * Description
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
	 * Description
	 * @param {string} argument_open
	 * @param {string} argument_close
	 * @param {boolean} [use_inner]
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
	 * Description
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
	 * Description
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
}
