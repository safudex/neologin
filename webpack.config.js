const path = require('path');

module.exports = [
	{
		entry: {
			login: './login/index.js',
			widget: './widget/index.js',
			example: './example/index.js',
		},
		mode: 'development',
		devtool: 'inline-source-map',
		output: {
			filename: '[name]/bundle.js',
			path: path.resolve(__dirname, 'dist')
		},
		devServer: {
			contentBase: './dist'
		},
	},{
		entry: "./provider/index.js",
		mode: 'development',
		output: {
			filename: 'headjack.js',
			libraryTarget: 'window',
			library: 'headjack',
			libraryExport: 'default',
			path: path.resolve(__dirname, 'dist')
		}
	}
];
