import { Parser } from 'marked';

import * as renderer from './renderer.js';
import * as tokenizer from './tokenizer.js';
import extensions from './extensions.js';

// https://github.com/markedjs/marked/issues/2639
const defaultParse = Parser.parse;
Parser.parse = (tokens, options) => {
	const [{ type, depth }] = tokens;
	if (type != "heading" || depth != 1) {
		tokens.unshift({
			type: 'heading',
			depth: 1,
			tokens: []
		});
	}
	return defaultParse.call(Parser, tokens, options);
};

export default {
	// marked-man defaults
	date: (() => {
		if (typeof process == "undefined" || !process.env.SOURCE_DATE_EPOCH) {
			return new Date();
		} else {
			return new Date(parseInt(process.env.SOURCE_DATE_EPOCH) * 1000);
		}
	})(),
	mangle: false,
	breaks: true,
	name: null,
	section: null,
	manual: null,
	manVersion: null,
	// output to roff
	renderer,
	tokenizer,
	// custom fixes
	extensions
};
