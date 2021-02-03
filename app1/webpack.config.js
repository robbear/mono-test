const path = require('path');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'client/generated'),
    filename: 'bundle.js'
  },
  mode: 'production',
  plugins: []
}
