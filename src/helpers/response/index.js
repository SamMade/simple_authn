const corsHeader = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

module.exports = {
  successResponse: function(token) {
    return {
      statusCode: 200,
      headers: corsHeader,
      body: JSON.stringify({
        token,
      }),
    }
  },
  errorResponse: function(statusCode, message) {
    return {
      statusCode: statusCode,
      headers: corsHeader,
      body: JSON.stringify({
        error: true,
        message: message,
      }),
    }
  }
}
