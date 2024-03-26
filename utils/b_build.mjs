// @ts-check
import { builder } from '../builder.mjs';
import { input_helpers } from './input_helpers.mjs';

export class b_build {
	helper = {
		uncomment_identifier: () => `${this.build_prefix}attr`,
	};
	default = {
		classes: 'app_modules/builder/classes',
		watch: 'h_export',
	};
	build_identifier = 'build';
	build_prefix = 'b-';
	attribute_delimiter = ';';
	attribute_delimiter_2 = ',';
	attribute_delimiter_3 = '^';
	content_regex = '([\\s\\S]*?)';
	/**
	 * @type {import("./input_helpers.mjs").input_helpers}
	 */
	input_helpers;
	/**
	 * Description
	 * @param {builder} builder
	 */
	constructor(builder) {
		if (builder.delimiters !== null) {
			[this.attribute_delimiter_2, this.attribute_delimiter_3 = this.attribute_delimiter_3] =
				builder.delimiters;
		}
		this.builder = builder;
		this.input_helpers = new input_helpers(this);
	}
	path = {
		classes: '/app_modules/builder',
	};
	/**
	 * Description
	 * @param {string} extention
	 * @param {import('../builder.mjs').rename_rules} [opening_closing_tag_rules]
	 */
	export_identifier = (extention, opening_closing_tag_rules = null) => {
		if (opening_closing_tag_rules !== null) {
			for (const rule in opening_closing_tag_rules) {
				if (this.input_helpers.likes(extention, rule)) {
					return opening_closing_tag_rules[rule];
				}
			}
		}
		switch (true) {
			case this.input_helpers.likes(extention, 'jsx', 'tsx'):
				return ['{/* b-build: start */}', '{/* b-build: end */}'];
			default:
				return ['<!-- b-build: start -->', '<!-- b-build: end -->'];
		}
	};
}
