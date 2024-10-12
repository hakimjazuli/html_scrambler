// @ts-check

import { HTMLScrambler, Builder } from '@html_first/html_scrambler';

export default class extends Builder {
	/**
	 * @param {Array<string>} targetAttributeNValue
	 * string[]: `${targetAttribute}${HTMLScrambler.__._separator[1]}${value}`[]
	 */
	static select = async (...targetAttributeNValue) => {
		const optionChild = Builder.element.querySelector('option');
		if (!optionChild) {
			return;
		}
		for (let i = 0; i < targetAttributeNValue.length; i++) {
			const [attribute, value, modeAttrOrProp = 'attr'] = Builder.splitX(
				targetAttributeNValue[i],
				HTMLScrambler.__._separator[1]
			);
			switch (modeAttrOrProp) {
				case 'attr':
					optionChild.setAttribute(attribute, value);
					break;
				case 'prop':
					optionChild[attribute] = value;
					break;
			}
		}
	};
	/**
	 * @param {string} tag
	 * @param {string} attributeIdentifier
	 * @param {string[]} likes
	 */
	static disable = async (tag, attributeIdentifier, ...likes) => {
		const elements = Builder.document.querySelectorAll(tag);
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i];
			if (element.hasAttribute(attributeIdentifier)) {
				if (
					likes.some((like) =>
						// @ts-ignore
						element.getAttribute(attributeIdentifier).includes(like)
					)
				) {
					element.remove();
				}
			}
		}
	};
	static inner = this.replaceWithInner;
}
