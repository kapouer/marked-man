var fs = require('fs');
var marked = require('../');
var Path = require('path');
var exec = require('child_process').exec;

// params
var testdir = Path.join(__dirname, "files");
var srcExt = ".ronn";
var roffExt = ".roff";
var dstExt = ".man";
var errExt = ".err";

var convert = function(filename, str, cb) {
	var roff = marked.parse(str, {
		format: "roff",
		name: filename,
		date:'1979-01-01',
		gfm: true,
		breaks: true
	});
	var roffpath = Path.join(testdir, filename + roffExt);
	try {
		fs.writeFileSync(roffpath, roff);
	} catch(e) {
		return cb(e);
	}
	exec('man --warnings -E UTF-8 ' + roffpath, {env: {"LANG":"C"}}, function(err, stdout, stderr) {
		if (stderr) console.error(stderr);
		cb(err, stdout);
	});
};



fs.readdir(testdir, function(err, files) {
	if (err) throw err;
	var fails = 0,
			works = 0,
			news = 0;
	var launched = 0;
	files.forEach(function(path) {
		if (Path.extname(path) != srcExt) return;
		launched++;
		compare(path, function(err, status) {
			if (err) console.error(err);
			launched--;
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
			if (!launched) {
				if (fails > 0) console.error("Failed tests: ", fails);
				if (works > 0) console.log("Succeeded tests: ", works);
				if (news > 0) console.log("New tests: ", news);
				if (fails == 0) console.log("All tests passed");
				else process.exit(1);
			}
		});
	});
});

function compare(path, cb) {
	var buf = fs.readFileSync(Path.join(testdir, path));
	var filename = Path.basename(path, Path.extname(path));
	var dest = Path.join(testdir, filename + dstExt);
	var output = convert(filename, buf.toString(), function(err, output) {
		var status = 0;
		if (err) return cb(err, 0);
		try {
			var expect = fs.readFileSync(dest);
			if (expect != output) {
				var errpath = dest + errExt;
				console.error("Test failure, result written in", errpath);
				fs.writeFileSync(errpath, output);
				status = -1;
			} else {
				fs.unlinkSync(Path.join(testdir, filename + roffExt));
			}
		} catch(e) {
			fs.writeFileSync(dest, output);
			status = 1;
		}
		cb(null, status);
	});
}
