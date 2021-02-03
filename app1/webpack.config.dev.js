const path = require('path');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'client/generated'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: []
}
