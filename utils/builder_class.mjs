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
	split;
	/**
	 * Description
	 * @param {h_builder} h_builder
	 */
	constructor(h_builder) {
		this.h_builder = h_builder;
		this.split = this.h_builder.split;
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
	/**
	 * Description
	 * @param {string} new_tag
	 */
	tag = async (new_tag) => {
		const build_element_attribute = this.h_builder.element.attributes;
		const new_element = this.h_builder.document.createElement(new_tag);
		for (var i = 0; i < build_element_attribute.length; i++) {
			const attribute = build_element_attribute[i];
			new_element.setAttribute(attribute.name, attribute.value);
		}
		new_element.innerHTML = this.h_builder.element.innerHTML;
		const parent_node = this.h_builder.element.parentNode;
		if (parent_node) {
			parent_node.replaceChild(new_element, this.h_builder.element);
		}
	};
	/**
	 * Description
	 * @param {string} attribute
	 */
	attr = async (attribute) => {
		const uncomment_identifier = this.h_builder.b_build.helper.uncomment_identifier();
		let attribute_ = '';
		if (
			this.h_builder.element.hasAttribute(
				this.h_builder.b_build.helper.uncomment_identifier()
			)
		) {
			// @ts-ignore
			attribute_ = this.h_builder.element.getAttribute(uncomment_identifier);
		}
		this.h_builder.element.setAttribute(
			uncomment_identifier,
			`${attribute_} ${attribute}`.trim()
		);
	};
	/**
	 * Description
	 * @param {string} new_dir
	 * @param {false|string} replace
	 * replace original element (in the parent file) with string
	 */
	partial = (new_dir, replace = false) => {
		this.h_builder.save_to(new_dir, async () => {
			if (replace !== false) {
				this.replace_with(replace);
				return false;
			}
			return true;
		});
	};
}
