import { resc, parseHeader } from './utils.js';

export function code(code, infostring, escaped) {
	return [
		'.RS 2',
		'.nf',
		resc(code, true),
		'.fi',
		'.RE',
		''
	].join('\n');
}

export function blockquote(quote) {
	return '.QP\n'
		+ quote
		+ '\n.\n';
}

export function html(html) {
	return resc(html);
}


export function heading(text, level, raw, slugger) {
	let macro;
	if (level == 1) {
		macro = 'TH';
		text = parseHeader(raw || "", this.options);
	} else if (level == 2) {
		macro = 'SH';
	} else {
		macro = 'SS';
	}
	return '.'
		+ macro
		+ ' '
		+ text
		+ '\n';
}

export function hr() {
	return '.HR\n';
}

export function list(body, ordered, start) {
	const { listLevel = 0 } = this;
	this.listLevel++;

	const indent = listLevel ? '.RS\n' : '.RS 0\n';
	return indent
		+ body
		+ '\n.RE\n';
}
export function listitem(text, task, checked) {
	let offset = 2;
	return `.IP \\(bu ${offset}\n${text}`;
}

export function checkbox(checked) {

}
export function paragraph(text) {
	return '.P\n'
		+ text
		+ '\n';
}
export function table(header, body) {
	return [
		'.TS',
		'tab(|) expand nowarn box;',
		header,
		'_',
		body,
		'.TE'
	].join('\n');
}

export function tablerow(content) {
	return '|' + content;
}

export function tablecell(content, flags) {
	return ['T{', content, '}T'].join('\n');
}


export function strong(text) {
	return '\\fB'
		+ text
		+ '\\fR';
}

export function em(text) {
	return '\\fI'
		+ text
		+ '\\fR';
}

export function codespan(code) {
	return '\\fB'
		+ resc(code, true)
		+ '\\fP';
}

export function br() {
	return '\n.br\n';
}

export function del(text) {
	return "-"
		+ resc(text)
		+ "-";
}

export function link(href, title, text) {
	const mailto = href.startsWith('mailto:') || !href.includes('://') && href.includes('@');
	href = resc(href);

	if (mailto) {
		return [".MT " + href, text, ".ME", ""].join('\n');
	} else {
		return [".UR " + href, text, ".UE", ""].join('\n');
	}
}

export function image(href, title, text) {
	href = resc(href);
	if (href == text) {
		return '\\fI'
			+ href
			+ '\\fR';
	} else {
		return '\\fI'
			+ text
			+ '\\fR[' + href + ']';
	}
}

export function text(text) {
	return resc(text);
}
