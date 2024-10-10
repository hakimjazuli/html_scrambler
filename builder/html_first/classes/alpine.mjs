// @ts-check
import { Builder } from '@html_first/html_scrambler';

export default class extends Builder {
	/**
	 * @param {string} forArgument
	 * @param {string} key
	 * - alpine looped element identifier
	 * @param {false|string} [useInner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	static for = async (forArgument, key = 'id', useInner = false) => {
		Builder.surroundWith(
			`<template x-for_="${forArgument}" :key="${key}">`,
			'</template>',
			useInner
		);
	};
	/**
	 * @param {string} ifArgument
	 * @param {false|string} [surroundInner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	static if = async (ifArgument, surroundInner = false) => {
		Builder.surroundWith(`<template x-if="${ifArgument}">`, '</template>', surroundInner);
	};
}
