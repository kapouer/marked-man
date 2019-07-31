var fs = require('fs');
var marked = require('../');
var Path = require('path');
var exec = require('child_process').exec;

// params
var ronnDir = Path.join(__dirname, "md");
var manDir = Path.join(__dirname, "man");
var outDir = Path.join(__dirname, "out");

function convert(name, str, cb) {
	var roff = marked.parse(str, {
		format: "roff",
		name: name,
		date:'1979-01-01',
		gfm: true,
		breaks: true
	});
	var manPath = Path.join(manDir, name);
	var status = writeOrCompare(roff, manPath);
	if (status < 0) manPath += '.err';
	exec('man --warnings -E UTF-8 ' + manPath, {env: {
		LANG:"C",
		MAN_KEEP_FORMATTING: '1',
		MANWIDTH: "80"
	}}, function(err, stdout, stderr) {
		if (stderr) console.error(stderr);
		cb(err, stdout);
	});
}



fs.readdir(ronnDir, function(err, files) {
	if (err) throw err;
	var fails = 0,
		works = 0,
		news = 0;
	Promise.all(files.map(function(file) {
		return new Promise(function(resolve, reject) {
			check(file, function(err, status) {
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
	})).then(function() {
		if (fails > 0) console.error("Failed tests: ", fails);
		if (works > 0) console.log("Succeeded tests: ", works);
		if (news > 0) console.log("New tests: ", news);
		if (fails == 0) console.log("All tests passed");
		else process.exit(1);
	});
});

function writeOrCompare(str, path) {
	var status = 0;
	try {
		var expect = fs.readFileSync(path).toString();
		var errpath = path + '.err';
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
	var ronnBuf = fs.readFileSync(Path.join(ronnDir, filename));
	var name = Path.basename(filename, Path.extname(filename));
	var destPath = Path.join(outDir, name);
	convert(name, ronnBuf.toString(), function(err, output) {
		if (err) return cb(err, 0);
		var status = writeOrCompare(output, destPath);
		cb(null, status);
	});
}
