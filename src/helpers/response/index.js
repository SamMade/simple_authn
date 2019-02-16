const globalHeaders = {
  'Access-Control-Allow-Origin': '*',
};

const headersJson = Object.assign({}, globalHeaders, {'Content-Type': 'application/json'});
const headersText = Object.assign({}, globalHeaders, {'Content-Type': 'text/plain'})

module.exports.successResponseText = function(statusCode = 200, text) {
  return {
    statusCode,
    headers: headersText,
    body: text,
  }
};

module.exports.successResponse = function(statusCode = 200, data) {
  return {
    statusCode,
    headers: headersJson,
    body: JSON.stringify({
      data,
    }),
  }
};

/**
 * 
 * @param {*} statusCode http status code
 * @param {*} message General error message
 * @param {*} errors Individul Errors
 */
module.exports.errorResponse = function(statusCode, message, errors = []) {
  const body = {
    error: {
      code: statusCode,
      message: message,
    }
  };

  if (errors.length) {
    body.error.errors = errors
  } 

  return {
    statusCode: statusCode,
    headers: headersJson,
    body: JSON.stringify(body),
  }
};
