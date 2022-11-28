#!/usr/bin/env node

import markedMan from 'marked-man';
import { marked } from 'marked';

const { argv } = process;
argv.forEach((arg, i) => {
	if (arg.startsWith("--version")) {
		argv[i] = arg.replace(/^--version/, "--man-version");
	}
});

let fileArg = argv.slice(-1)[0];
if (fileArg == argv[1] || fileArg.startsWith('-')) {
	fileArg = null;
}
markedMan.fileArg = fileArg;

marked.use(markedMan);

import('marked/bin/marked');
