import * as renderer from './renderer.js';
import * as tokenizer from './tokenizer.js';

export default {
	// marked-man defaults
	date: (() => {
		if (typeof process == "undefined" || !process.env.SOURCE_DATE_EPOCH) {
			return new Date();
		} else {
			return new Date(parseInt(process.env.SOURCE_DATE_EPOCH) * 1000);
		}
	})(),
	name: null,
	section: null,
	manual: null,
	manVersion: null,
	// output to roff
	renderer,
	tokenizer,
	// custom fixes
	extensions: [{
		name: 'heading',
		level: 'block',
		tokenizer(src, tokens) {
			if (!tokens.length) return;
			const [{type, depth}] = tokens;
			if (type != "heading" || depth != 1) {
				tokens.unshift({
					type: 'heading',
					depth: 1,
					tokens: []
				});
			}
		}
	}]
};
