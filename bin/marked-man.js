#!/usr/bin/env node

import markedMan from 'marked-man';
import { marked } from 'marked';

marked.use(markedMan);

process.argv.forEach((arg, i) => {
	if (arg.startsWith("--version")) {
		process.argv[i] = arg.replace(/^--version/, "--man-version");
	}
});

import('marked/bin/marked');
