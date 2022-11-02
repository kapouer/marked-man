import * as renderer from './renderer.js';
import * as tokenizer from './tokenizer.js';

export default {
	get date() {
		if (typeof process == "undefined" || !process.env.SOURCE_DATE_EPOCH) {
			return new Date();
		} else {
			return new Date(parseInt(process.env.SOURCE_DATE_EPOCH) * 1000);
		}
	},
	manVersion: null,
	gfm: true,
	breaks: false,
	renderer,
	tokenizer,
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
