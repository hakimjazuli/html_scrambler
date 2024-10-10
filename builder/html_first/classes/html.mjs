// @ts-check
import { Builder } from '@html_first/html_scrambler';

export default class extends Builder {
	/**
	 * @param {string} className
	 * @param {string} method
	 * @param {...string} arguments_
	 */
	static compound = (className, method, ...arguments_) => {
		Builder.setBNext('php', 'if', '$data');
		Builder.setBNext(className, method, ...arguments_);
	};
}
