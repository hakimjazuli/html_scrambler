// @ts-check
import { builder_class } from '@html_first/html_scrambler';

export default class extends builder_class {
	compound = (class_name, method, ...arguments_) => {
		this.set_b_next('php', 'if', '$data');
		this.set_b_next(class_name, method, ...arguments_);
	};
}
