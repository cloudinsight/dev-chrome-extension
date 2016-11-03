const webpack = require('webpack');

module.exports = {
  entry: {
    background: "./src/background.js",
    popup: "./src/popup.js",
    content: "./src/content.js"
  },
  resolve: {
    extensions: ['', '.js', '.es6']
  },
  output: {
    path: "lib",
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: "babel"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}
