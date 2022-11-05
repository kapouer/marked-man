import { resc, parseHeader } from './utils.js';

export function code(code, infostring, escaped) {
	this.jumps = true;
	return [
		'.RS 2',
		'.nf',
		code,
		'.fi',
		'.RE',
		''
	].join('\n');
}

export function blockquote(quote) {
	this.jumps = true;
	return '.QP\n'
		+ quote
		+ '\n.\n';
}

export function html(html) {
	return resc(html);
}


export function heading(text, level, raw, slugger) {
	this.jumps = true;
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
	this.jumps = true;
	return '.HR\n';
}

export function list(body, ordered, start, loose) {
	return [
		'\n.RS',
		body,
		'.RE',
		''
	].join('\n');
}
export function listitem(text, task, checked, loose) {
	return [
		`.IP \\(bu 2`,
		text.trim().replace(/^.P\s/, ''),
		''
	].join('\n');
}

export function checkbox(checked) {

}

export function paragraph(text) {
	this.jumps = true;
	const ret = [
		'.P',
		text.trim()
	];
	if (text) ret.push('');
	return ret.join('\n');
}

export function table(header, body) {
	this.jumps = false;
	const { tableCols } = this;
	delete this.tableCols;
	return [
		'.TS',
		'tab(|) expand nowarn box;',
		tableCols.join(' ') + '.',
		dropLastRowSep(header.trim()),
		'=',
		dropLastRowSep(body.trim()),
		'.TE',
		''
	].join('\n');
}

export function tablerow(content) {
	if (this.tableCols) this.tableCols.done = true;
	return dropLastCellSep(content) + '\n_\n';
}

export function tablecell(content, flags) {
	if (!this.tableCols) this.tableCols = [];
	if (!this.tableCols.done) {
		this.tableCols.push(getCellAlign(flags.align));
	}
	return ['T{', content, 'T}|'].join('\n');
}
function dropLastRowSep(str) {
	return str.replace(/\n_$/, '');
}
function dropLastCellSep(str) {
	return str.replace(/\|$/, '');
}
function getCellAlign(align) {
	switch (align) {
		case "right":
			return "r";
		case "center":
			return "c";
		default:
			return "l";
	}
}

export function strong(text) {
	this.jumps = false;
	return '\\fB'
		+ text
		+ '\\fR';
}

export function em(text) {
	this.jumps = false;
	return '\\fI'
		+ text
		+ '\\fR';
}

export function codespan(code) {
	this.jumps = false;
	return '\\fB'
		+ resc(code, true)
		+ '\\fP';
}

export function br() {
	this.jumps = true;
	return '\n.br\n';
}

export function del(text) {
	return "-"
		+ resc(text)
		+ "-";
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
	if (this.jumps) {
		text = text.trimStart();
		this.jumps = false;
	}
	return resc(text);
}
