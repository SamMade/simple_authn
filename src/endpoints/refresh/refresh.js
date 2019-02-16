const jwt = require('jsonwebtoken');
const responses = require('../../helpers/response');
const {tokenExpirationTime} = require('../../helpers/token');

function extractInputs(event) {
  if (!event.headers || !event.headers.Authorization) {
    throw new Error('TOKEN_MISSING');
  }

  return event.headers.Authorization;
}

module.exports.handler = async (event) => {
  try {
    var authorizationHeader = extractInputs(event);
  } catch (e) {
    return responses.errorResponse(400, e.message);
  }

  try {
    if (!authorizationHeader.startsWith('Bearer ')) {
      throw new Error('MALFORMED_TOKEN');
    }
    const token = authorizationHeader.substring('Bearer '.length);

    const payload = jwt.verify(token, process.env.JWT_SECRET, ["HS256"]);
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;
    const jwtSignOptions = Object.assign({ }, this.options, { expiresIn: tokenExpirationTime });

    const newtoken = jwt.sign(payload, process.env.JWT_SECRET, jwtSignOptions);

    // Return response
    return responses.successResponseText(200, newtoken);
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return responses.errorResponse(401, e.message);
    }
    return responses.errorResponse(400, e.message);
  }
};