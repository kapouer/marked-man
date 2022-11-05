export function quote(str) {
	return '"' + str + '"';
}

export function manEsc(str) {
	return str
		.replace(/\\/gm, "\\\\")
		.replace(/-/gm, "\\-")
		.replace(/^\s*\./gm, "\\|.")
		.replace(/\./gm, "\\.")
		.replace(/^'/gm, "\\|'");
}

export function htmlEsc(str) {
	return rentities(manEsc(str))
		.replace(/&gt;/gm, '>')
		.replace(/&lt;/gm, '<')
		.replace(/&amp;/gm, '&');
}

export function rentities(str) {
	return str.replace(/&(\w+);/gm, (match, ent) => {
		const gr = {
			bull: '[ci]',
			nbsp: '~',
			copy: '(co',
			rdquo: '(rs',
			mdash: '(em',
			reg: '(rg',
			sect: '(sc',
			ge: '(>=',
			le: '(<=',
			ne: '(!=',
			equiv: '(==',
			plusmn: '(+-'
		}[ent];
		if (gr) return '\\' + gr;
		else return match;
	});
}

export function parseHeader(str, options) {
	const {
		groups: {
			name = options.name || "",
			section = options.section || "",
			last = ""
		}
	} = /^(?<name>[\w_.[\]~+=@:-]+)\s*(?:\((?<section>\d\w*)\))?(?:\s*-+\s*(?<last>.*))?$/.exec(str) || { groups: {} };

	let text = last;
	if (!text) {
		if (name || section) text = "";
		else text = str;
	}
	if (name && text) text = " - " + text;

	return quote(manEsc(name.toUpperCase()))
		+ " "
		+ quote(section || "")
		+ " "
		+ quote(manDate(options.date))
		+ " "
		+ quote(options.manVersion || "")
		+ " "
		+ quote(options.manual || "")
		+ "\n.SH "
		+ quote("NAME")
		+ "\n\\fB"
		+ name
		+ "\\fR"
		+ manEsc(text);
}

export function manDate(date) {
	const stamp = parseInt(date);
	if (!Number.isNaN(stamp) && stamp.toString().length == date.length) date = stamp;
	date = new Date(date);
	return date.toLocaleString('en', { month: 'long', year: 'numeric' });
}

