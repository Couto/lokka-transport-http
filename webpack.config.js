const webpack = require('webpack');

module.exports = {

  entry: './lib/index.js',

  output: {
    filename: 'lokka-transport-http.js',
    path: '.',
    libraryTarget: 'umd',
  },

  externals: {
    'lokka': 'lokka',
    'lokka/transport': 'LokkaTransport'
  },

  plugins: [
    new webpack.optimize.DedupePlugin()
  ],

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json' }
    ]
  }
};
