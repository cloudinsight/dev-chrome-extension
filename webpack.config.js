const path = require('path');

module.exports = {
  entry: {
    background: './src/background.js',
    content: './src/content.js'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'lib')
  }
}
