const path = require('path');

module.exports = {
  entry: {
	  login: './login/index.js',
	  widget: './widget/index.js',
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
  /*module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }*/
};
