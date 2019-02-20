const path = require('path');

module.exports = {
  entry: {
    // 'hello': './src/endpoints/hello/hello.js',
    'login': './src/endpoints/login/login.js',
    'refresh': './src/endpoints/refresh/refresh.js',
    'register': './src/endpoints/register/register.js',
    'verify': './src/endpoints/verify/verify.js',
    'verifySendEmail': './src/endpoints/verify/sendEmail.js',
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  externals: {
    'aws-sdk': 'aws-sdk'
  },
  target: 'node',
};