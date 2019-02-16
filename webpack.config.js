const path = require('path');

module.exports = {
  entry: {
    // 'hello': './src/endpoints/hello/hello.js',
    'login': './src/endpoints/login/login.js',
    'refresh': './src/endpoints/refresh/refresh.js',
    'register': './src/endpoints/register/register.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'endpoints'),
    libraryTarget: 'commonjs2',
  },
  externals: {
    'aws-sdk': 'aws-sdk'
  },
  target: 'node',
};