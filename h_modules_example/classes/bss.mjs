// @ts-check
import { builder_class } from 'html_scrambler';

export class bss extends builder_class {
	/**
	 * Description
	 * @param {Array<string>} target_attribute_n_value
	 * - ...attribute_name,attribute_value,mode_attr_or_prop;
	 */
	select = async (...target_attribute_n_value) => {
		const option_child = this.h_builder.element.querySelector('option');
		if (!option_child) {
			return;
		}
		for (let i = 0; i < target_attribute_n_value.length; i++) {
			const [attribute, value, mode_attr_or_prop = 'attr'] = this.h_builder.split(
				target_attribute_n_value[i],
				this.h_builder.b_build.attribute_delimiter_2
			);
			switch (mode_attr_or_prop) {
				case 'attr':
					option_child.setAttribute(attribute, value);
					break;
				case 'prop':
					option_child[attribute] = value;
					break;
			}
		}
	};
	/**
	 * Description
	 * @param {string} tag
	 * @param {string} attribute_identifier
	 * @param {string[]} likes
	 */
	disable = async (tag, attribute_identifier, ...likes) => {
		const elements = this.h_builder.document.querySelectorAll(tag);
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i];
			if (element.hasAttribute(attribute_identifier)) {
				if (
					likes.some((like) =>
						// @ts-ignore
						element.getAttribute(attribute_identifier).includes(like)
					)
				) {
					element.remove();
				}
			}
		}
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