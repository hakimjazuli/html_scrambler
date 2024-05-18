// @ts-check
import { _BuilderClass } from '@html_first/html_scrambler';

export default class extends _BuilderClass {
	/**
	 * @param {string} foreach_argument
	 * @param {string|false} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	foreach = async (foreach_argument, use_inner = false) => {
		this.surround_with(`<?php foreach(${foreach_argument}){?>`, '<?php };?>', use_inner);
	};
	/**
	 * @param {string} if_argument
	 * @param {string|false} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	if = async (if_argument, use_inner = false) => {
		this.surround_with(`<?php if(${if_argument}){?>`, '<?php };?>\n', use_inner);
	};
}
