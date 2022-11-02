export function inlineText(src) {
	const cap = this.rules.inline.text.exec(src);
	if (cap) {
		return {
			type: 'text',
			raw: cap[0],
			text: cap[0]
		};
	}
}
