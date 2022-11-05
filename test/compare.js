import {promises as fs} from 'fs';
import * as Path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const execa = promisify(exec);

import markedMan from 'marked-man';
import { marked } from 'marked';

marked.use(markedMan);

// params
const ronnDir = Path.join(__dirname, "md");
const manDir = Path.join(__dirname, "man");
const outDir = Path.join(__dirname, "out");

main();

async function convert(name, str) {
	const roff = marked.parse(str, {
		name,
		date: '1979-01-01',
		breaks: true
	});
	let manPath = Path.join(manDir, name);
	const status = await writeOrCompare(roff, manPath);
	if (status < 0) manPath += '.err';
	const { stdout, stderr } = await execa(`man --warnings --encoding=UTF-8 ${manPath}.1`, {
		env: {
			LC_ALL: "C.UTF-8",
			MAN_KEEP_FORMATTING: '1',
			MANWIDTH: "80"
		}
	});
	if (stderr) console.error(manPath, '\n', stderr);
	return stdout;
}

async function main() {
	const files = await fs.readdir(ronnDir);
	let fails = 0,
		works = 0,
		news = 0;
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
	if (fails == 0) console.info("All tests passed");
	else process.exit(1);
}

async function writeOrCompare(str, path) {
	let status = 0;
	const okpath = path + ".1";
	try {
		const expect = (await fs.readFile(okpath)).toString();
		const errpath = path + '.err.1';
		if (expect != str) {
			console.error("Test failure, result written in", errpath);
			status = -1;
		}
		await fs.writeFile(errpath, str);
	} catch(e) {
		await fs.writeFile(okpath, str);
		status = 1;
	}
	return status;
}

async function check(filename) {
	const ronnBuf = await fs.readFile(Path.join(ronnDir, filename));
	const name = Path.basename(filename, Path.extname(filename));
	const destPath = Path.join(outDir, name);
	const output = await convert(name, ronnBuf.toString());
	const status = await writeOrCompare(output, destPath);
	return status;
}
