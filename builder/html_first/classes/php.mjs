// @ts-check
import { Builder } from '@html_first/html_scrambler';

export default class extends Builder {
	/**
	 * @param {string} foreachArgument
	 * @param {string|false} [surroundInner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	static foreach = async (foreachArgument, surroundInner = false) => {
		Builder.surroundWith(
			`\n<?php foreach(${foreachArgument}){?>\n`,
			'\n<?php };?>\n',
			surroundInner
		);
	};
	/**
	 * @param {string} ifArgument
	 * @param {string|false} [surroundInner]
	 * - false default: use outerHTML of the element to be looped
	 * - true;
	 */
	static if = async (ifArgument, surroundInner = false) => {
		Builder.surroundWith(`\n<?php if(${ifArgument}){?>\n`, '\n<?php };?>\n', surroundInner);
	};
}
