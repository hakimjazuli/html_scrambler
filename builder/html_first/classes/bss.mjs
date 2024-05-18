// @ts-check
import { _BuilderClass, __AppSettings } from '@html_first/html_scrambler';

export default class extends _BuilderClass {
	/**
	 * @param {Array<string>} target_attribute_n_value
	 * string[]: `${target_attribute}${__AppSettings.__._separator[1]}${value}`[]
	 */
	select = async (...target_attribute_n_value) => {
		const option_child = this.builder.element.querySelector('option');
		if (!option_child) {
			return;
		}
		for (let i = 0; i < target_attribute_n_value.length; i++) {
			const [attribute, value, mode_attr_or_prop = 'attr'] = this.builder.split(
				target_attribute_n_value[i],
				__AppSettings.__._separator[1]
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
	 * @param {string} tag
	 * @param {string} attribute_identifier
	 * @param {string[]} likes
	 */
	disable = async (tag, attribute_identifier, ...likes) => {
		const elements = this.builder.document.querySelectorAll(tag);
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
