import { promises as fs } from 'fs';
import * as Path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const curDir = Path.dirname(fileURLToPath(import.meta.url));
const execa = promisify(exec);

import markedMan from 'marked-man';
import { marked } from 'marked';

marked.use(markedMan);

// params
const ronnDir = Path.join(curDir, "md");
const manDir = Path.join(curDir, "man");
const outDir = Path.join(curDir, "out");

main(process.argv.slice(2).map(filepath => Path.join('../..', filepath)));

async function convert(name, str) {
	const roff = marked.parse(str, {
		name,
		date: '1979-01-01',
		breaks: true
	});
	const [status, manPath] = await writeOrCompare(roff, manDir, name + ".1");
	const { stdout, stderr } = await execa(`man --warnings --encoding=UTF-8 ${manPath}`, {
		env: {
			LC_ALL: "C.UTF-8",
			MAN_KEEP_FORMATTING: '1',
			MANWIDTH: "80"
		}
	});
	if (stderr) console.error(manPath, '\n', stderr);
	return [status, stdout];
}

async function main(tests) {
	const files = tests.length > 0 ? tests : await fs.readdir(ronnDir);
	let fails = 0,
		works = 0,
		news = 0;
	try {
		await fs.rm(manDir + "-err", { recursive: true });
		await fs.rm(outDir + "-err", { recursive: true });
	} catch (err) {
		// pass
	}
	await fs.mkdir(manDir + "-err", { recursive: true });
	await fs.mkdir(outDir + "-err", { recursive: true });
	await Promise.all(files.map(async file => {
		const status = await check(file);
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
	}));
	if (fails > 0) console.error("Failed tests: ", fails);
	if (works > 0) console.info("Succeeded tests: ", works);
	if (news > 0) console.info("New tests: ", news);
	if (fails == 0) {
		console.info("All tests passed");
		await fs.rm(manDir + "-err", { recursive: true });
		await fs.rm(outDir + "-err", { recursive: true });
	} else {
		process.exit(1);
	}
}

async function writeOrCompare(str, root, name) {
	const okpath = Path.join(root, name);
	const errpath = Path.join(root + "-err", name);
	await fs.writeFile(errpath, str);
	let status = 0;
	try {
		await fs.access(okpath);
	} catch (e) {
		console.info("Missing test, result written in", okpath);
		await fs.writeFile(okpath, str);
		status = 1;
	}
	try {
		await execa(
			`diff --unified --ignore-space-change ${okpath} ${errpath}`
		);
		await fs.unlink(errpath);
	} catch (e) {
		console.error("Test failure");
		console.error(e.stdout);
		status = -1;
	}
	return [status, status >= 0 ? okpath : errpath];
}

async function check(filename) {
	const ronnBuf = await fs.readFile(Path.join(ronnDir, filename));
	const name = Path.basename(filename, Path.extname(filename));
	const [statusMan, output] = await convert(name, ronnBuf.toString());
	if (statusMan != 0) return statusMan;
	const [statusOut] = await writeOrCompare(output, outDir, name + ".out");
	return statusOut;
}
