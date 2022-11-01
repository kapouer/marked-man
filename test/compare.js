const fs = require('node:fs');
const Path = require('node:path');
const { exec } = require('node:child_process');
const marked = require('../');

// params
const ronnDir = Path.join(__dirname, "md");
const manDir = Path.join(__dirname, "man");
const outDir = Path.join(__dirname, "out");

function convert(name, str, cb) {
	const roff = marked.parse(str, {
		format: "roff",
		name: name,
		date:'1979-01-01',
		gfm: true,
		breaks: true
	});
	let manPath = Path.join(manDir, name);
	const status = writeOrCompare(roff, manPath);
	if (status < 0) manPath += '.err';
	exec('man --warnings -E UTF-8 ' + manPath, {env: {
		LANG:"C",
		MAN_KEEP_FORMATTING: '1',
		MANWIDTH: "80"
	}}, (err, stdout, stderr) => {
		if (stderr) console.error(stderr);
		cb(err, stdout);
	});
}



fs.readdir(ronnDir, (err, files) => {
	if (err) throw err;
	let fails = 0,
		works = 0,
		news = 0;
	Promise.all(files.map((file) => {
		return new Promise((resolve, reject) => {
			check(file, (err, status) => {
				if (err) return reject(err);
				switch (status) {
					case -1:
						fails++;
						break;
					case 0:
						works++;
						break;
					case 1:
						news++;
						break;
				}
				resolve();
			});
		});
	})).then(() => {
		if (fails > 0) console.error("Failed tests: ", fails);
		if (works > 0) console.info("Succeeded tests: ", works);
		if (news > 0) console.info("New tests: ", news);
		if (fails == 0) console.info("All tests passed");
		else process.exit(1);
	});
});

function writeOrCompare(str, path) {
	let status = 0;
	try {
		const expect = fs.readFileSync(path).toString();
		const errpath = path + '.err';
		if (expect != str) {
			console.error("Test failure, result written in", errpath);
			status = -1;
		}
		fs.writeFileSync(errpath, str);
	} catch(e) {
		fs.writeFileSync(path, str);
		status = 1;
	}
	return status;
}

function check(filename, cb) {
	const ronnBuf = fs.readFileSync(Path.join(ronnDir, filename));
	const name = Path.basename(filename, Path.extname(filename));
	const destPath = Path.join(outDir, name);
	convert(name, ronnBuf.toString(), (err, output) => {
		if (err) return cb(err, 0);
		const status = writeOrCompare(output, destPath);
		cb(null, status);
	});
}
