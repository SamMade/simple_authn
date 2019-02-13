const jwt = require('jsonwebtoken');
const responses = require('../../helpers/response');
const {tokenExpirationTime} = require('../../helpers/token');

// this should be replaced with a real authorization mechanism
// so many things wrong with this but used just for simplification
const users = {
  users: {
    'foo': 'bar'
  },
  login: function(username, password) {
    const userMatch = Object.keys(this.users).some(user => user === username);
    if (!userMatch) { throw new Error('User Not Found'); }
    if (this.users[username] != password) { throw new Error('Invalid Credentials'); }
    return true;
  }
};
// end sample authorization

module.exports.handler = (event, context, callback) => {
  try {
    var { username, password } = JSON.parse(event.body);
  } catch (e) {
    callback(null, responses.errorResponse(400, e.message));
  }

  try {
    // Authenticate user
    users.login(username, password);

    const tokenPayload = {
      username,
    }

    // Issue JWT
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: tokenExpirationTime });

    // Return response
    callback(null, responses.successResponse(token));
  } catch (e) {
    callback(null, responses.errorResponse(401, e.message));
  }
};