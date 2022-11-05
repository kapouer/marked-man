#!/usr/bin/env node

import markedMan from 'marked-man';
import { marked } from 'marked';

process.argv.forEach((arg, i) => {
	if (arg.startsWith("--version")) {
		process.argv[i] = arg.replace(/^--version/, "--man-version");
	}
});

marked.use(markedMan);

import('marked/bin/marked');

