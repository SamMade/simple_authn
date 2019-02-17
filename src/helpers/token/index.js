module.exports = {
  tokenExpirationTime: '5m',

  validate: function(authorization) {
    if (!authorization) {
      throw new Error('TOKEN_MISSING');
    }
    if (!authorization.startsWith('Bearer ')) {
      throw new Error('MALFORMED_TOKEN');
    }
  
    const token = authorizationHeader.substring('Bearer '.length);
    return jwt.verify(token, process.env.JWT_SECRET, ["HS256"]);
  }
};