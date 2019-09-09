const path = require('path');

module.exports = [
	{
		entry: "./index.js",
		mode: 'production',
		output: {
			filename: 'neologin.js',
			libraryTarget: 'window',
			library: 'neologin',
			libraryExport: 'default',
			path: path.resolve(__dirname, '../dist')
		}
	}
];
