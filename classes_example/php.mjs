// @ts-check
import { builder_class } from 'html_scrambler';

export class php extends builder_class {
	/**
	 * Description
	 * @param {string} foreach_argument
	 * @param {boolean} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	foreach = async (foreach_argument, use_inner = false) => {
		this.surround_with(`<?php foreach(${foreach_argument}){?>`, '<?php };?>', use_inner);
	};
	/**
	 * Description
	 * @param {string} if_argument
	 * @param {boolean} [use_inner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	if = async (if_argument, use_inner = false) => {
		this.surround_with(`<?php if(${if_argument}){?>`, '<?php };?>', use_inner);
	};
}
