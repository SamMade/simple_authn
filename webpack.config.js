const path = require('path');

module.exports = {
  entry: {
    'hello': './src/endpoints/hello/index.js',
    'login': './src/endpoints/login/index.js',
    'refresh': './src/endpoints/refresh/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'endpoints'),
    libraryTarget: 'umd',
  },
  target: 'node',
};