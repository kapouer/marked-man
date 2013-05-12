var fs = require('fs');
var marked = require('../');
var Path = require('path');

// params
var testdir = Path.join(__dirname, "files");
var srcExt = ".md";
var dstExt = ".roff";
var errExt = ".err";

var convert = function(str) {
	return marked.parse(str, {format: "roff"});
};
// ******



fs.readdir(testdir, function(err, files) {
	if (err) throw err;
	var fails = 0,
			works = 0,
			news = 0;
	files.forEach(function(path) {
		if (Path.extname(path) == srcExt) {
			switch (compare(path)) {
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
		}
	});
	if (fails > 0) console.error("Failed tests: ", fails);
	if (works > 0) console.log("Succeeded tests: ", works);
	if (news > 0) console.log("New tests: ", news);
	if (fails == 0) console.log("All tests passed");
	else process.exit(1);
});

function compare(path) {
	var buf = fs.readFileSync(Path.join(testdir, path));
	var dest = Path.join(testdir, Path.basename(path, Path.extname(path)) + dstExt);
	var output = convert(buf.toString());
	var status = 0;
	try {
		var expect = fs.readFileSync(dest);
		if (expect != output) {
			var errpath = dest + errExt;
			console.error("Test failure, result written in", errpath);
			fs.writeFileSync(errpath, output);
			status = -1;
		}
	} catch(e) {
		fs.writeFileSync(dest, output);
		status = 1;
	}
	return status;
}
