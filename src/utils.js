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

	let out = quote(manEsc(name.toUpperCase()))
		+ " "
		+ quote(section || "1")
		+ " "
		+ quote(manDate(options.date))
		+ (options.manVersion ? " " + quote(options.manVersion) : "")
		+ (options.manual ? " " + quote(options.manual) : ""); // use default value
	if (!options.disableLevel2Name) {
		out = out
			+ "\n.SH "
			+ quote("NAME")
			+ "\n\\fB"
			+ name
			+ "\\fR"
			+ manEsc(text);
	} else {
		delete options.disableLevel2Name;
	}
	return out;
}

export function manDate(str) {
	let date;
	if (typeof str == "string") {
		const stamp = parseInt(str);
		if (!Number.isNaN(stamp) && stamp.toString().length == str.length) {
			date = new Date(stamp);
		}
	}
	if (!date) {
		date = new Date(str);
	}
	if (Number.isNaN(date.getTime())) {
		throw new Error("Bad date option: " + str);
	}
	return date.toLocaleString('en', {
		month: 'long', year: 'numeric', timeZone: 'UTC'
	});
}

