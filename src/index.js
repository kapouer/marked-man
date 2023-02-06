import { Parser } from 'marked';
import { readPackageUpSync } from 'read-pkg-up';
import Path from 'path';
import * as renderer from './renderer.js';
import * as tokenizer from './tokenizer.js';
import extensions from './extensions.js';

// https://github.com/markedjs/marked/issues/2639
const defaultParse = Parser.parse;
Parser.parse = (tokens, options) => {
	const [{ type, depth }, sec] = tokens;
	if (type != "heading" || depth != 1) {
		tokens.unshift({
			type: 'heading',
			depth: 1,
			tokens: []
		});
	}
	options.disableLevel2Name = sec && sec.type == "heading" && sec.depth == 2 && sec.text && sec.text.toUpperCase() == "NAME";

	return defaultParse.call(Parser, tokens, options);
};

export default {
	// marked-man defaults
	date: (() => {
		if (typeof process == "undefined" || !process.env.SOURCE_DATE_EPOCH) {
			return Date.now();
		} else {
			return parseInt(process.env.SOURCE_DATE_EPOCH) * 1000;
		}
	})(),
	mangle: false,
	breaks: true,
	name: null,
	section: null,
	manual: null,
	set manVersion(val) {
		this.userDefinedVersion = val;
	},
	get manVersion() {
		if (this.userDefinedVersion) {
			return this.userDefinedVersion;
		} else if (this.fileArg) {
			const pkg = readPackageUpSync(Path.dirname(this.fileArg));
			return pkg ? pkg.packageJson.version : null;
		} else {
			return null;
		}
	},
	// output to roff
	renderer,
	tokenizer,
	// custom fixes
	extensions
};
