const path = require('path');

module.exports = [
	{
		entry: "./index.js",
		mode: 'production',
		output: {
			filename: 'headjack.js',
			libraryTarget: 'window',
			library: 'headjack',
			libraryExport: 'default',
			path: path.resolve(__dirname, '../dist')
		}
	}
];
