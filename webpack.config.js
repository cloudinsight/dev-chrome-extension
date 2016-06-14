module.exports = {
  entry: {
    background: "./src/background.js",
    options: "./src/options.js",
    popup: "./src/popup.js"
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
  }
}
