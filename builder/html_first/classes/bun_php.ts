// @ts-check
import { _BuilderClass } from '@html_first/html_scrambler';

export default class extends _BuilderClass {
	/**
	 * @param foreach_argument
	 * @param use_inner
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	foreach = async (foreach_argument: string, use_inner: false | string = false) => {
		this.surround_with(`<?php foreach(${foreach_argument}){?>`, '<?php };?>', use_inner);
	};
	/**
	 * @param if_argument
	 * @param use_inner
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	if = async (if_argument: string, use_inner: string | false = false) => {
		this.surround_with(`<?php if(${if_argument}){?>`, '<?php };?>\n', use_inner);
	};
}
