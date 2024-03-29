// @ts-check
import { builder_class } from '@html_first/html_scrambler';

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
}
