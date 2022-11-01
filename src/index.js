import * as renderer from './renderer.js';

export default {
	get date() {
		if (typeof process == "undefined" || !process.env.SOURCE_DATE_EPOCH) {
			return new Date();
		} else {
			return new Date(parseInt(process.env.SOURCE_DATE_EPOCH) * 1000);
		}
	},
	manVersion: null,
	gfm: true,
	breaks: false,
	renderer
};
