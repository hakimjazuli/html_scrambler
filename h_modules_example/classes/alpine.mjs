// @ts-check
import { builder_class } from 'html_scrambler';

export class alpine extends builder_class {
	/**
	 * Description
	 * @param {string} for_argument
	 * @param {string} key
	 * - alpine looped element identifier
	 * @param {boolean} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	for = async (for_argument, key = 'id', use_inner = false) => {
		this.surround_with(
			`<template x-for_="${for_argument}" :key="${key}">`,
			'</template>',
			use_inner
		);
	};
	/**
	 * Description
	 * @param {string} if_argument
	 * @param {boolean} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	if = async (if_argument, use_inner = false) => {
		this.surround_with(`<template x-if="${if_argument}">`, '</template>', use_inner);
	};
}
