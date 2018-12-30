module.exports.handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {},
    isBase64Encoded: false,
    body: JSON.stringify({
      message: 'Hello World',
      input: event,
    }),
  };
  callback(null, response);
}