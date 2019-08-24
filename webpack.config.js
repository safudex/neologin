const path = require('path');

module.exports = {
  entry: {
	  login: './login/index.js',
	  widget: './widget/index.js',
  },
  mode: 'development',
  output: {
    filename: '[name]/bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  /*module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }*/
};
