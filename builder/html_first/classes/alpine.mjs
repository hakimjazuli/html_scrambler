// @ts-check
import { _BuilderClass } from '@html_first/html_scrambler';

export default class extends _BuilderClass {
	/**
	 * @param {string} for_argument
	 * @param {string} key
	 * - alpine looped element identifier
	 * @param {false|string} [use_inner]
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
	 * @param {string} if_argument
	 * @param {false|string} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	if = async (if_argument, use_inner = false) => {
		this.surround_with(`<template x-if="${if_argument}">`, '</template>', use_inner);
	};
}
