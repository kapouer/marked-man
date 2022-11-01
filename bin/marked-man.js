#!/usr/bin/env node

import markedMan from 'marked-man';
import { marked } from 'marked';

process.argv = process.argv.map(tok => {
	return tok.replace(/^--version/, "--man-version");
});

marked.use(markedMan);

if (process.env.SOURCE_DATE_EPOCH) {
	marked.use({
		date: new Date(process.env.SOURCE_DATE_EPOCH * 1000).toISOString()
	});
}

import 'marked/bin/marked';
