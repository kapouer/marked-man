const empty = {
	name: 'empty',
	level: 'inline',
	renderer() {
		return "";
	}
};

const link = {
	name: 'link',
	level: 'inline',
	tokenizer(src, tokens) {
		if (!tokens.length || /^\p{Po}/u.test(src) == false) return;
		const tok = tokens[tokens.length - 1];
		if (tok.type == "link") {
			tok.punctuation = src.charAt(0);
			return { type: "empty", raw: tok.punctuation };
		}
	},
	renderer({ href, title, text, punctuation }) {
		const mailto = href.startsWith('mailto:') || !href.includes('://') && href.includes('@');

		const ret = [""];

		const content = title || text || '';

		if (mailto) {
			ret.push(".MT " + href, content ? '.I ' + content : '', ".ME");
		} else {
			ret.push(".UR " + href, content ? '.I ' + content : '', ".UE");
		}
		if (punctuation) ret[ret.length - 1] += " " + punctuation;
		ret.push("");
		this.parser.renderer.jumps = true;
		return ret.join('\n');
	}
};

export default [empty, link];
