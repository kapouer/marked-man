import { quote, resc, parseHeader } from './utils.js';

export function code(code, infostring, escaped) {
	return '\\fB'
		+ resc(code, true)
		+ '\\fP';
}

export function blockquote(quote) {
	return '.QP\n'
		+ quote
		+ '\n.\n';
}

export function html(html) {
	return html;
}


export function heading(text, level, raw, slugger) {
	let macro;
	if (level == 1) {
		macro = 'TH';
		text = parseHeader(text || "", this.options);
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

}

export function tablerow(content) {

}

export function tablecell(content, flags) {

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

}

export function image(href, title, text) {

}

export function text(text) {
	return resc(text);
}
