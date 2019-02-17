
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const responses = require('../../helpers/response');
const {tokenExpirationTime} = require('../../helpers/token');

const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports.handler = async (event) => {
  try {
    var { username, password } = JSON.parse(event.body);
  } catch (e) {
    console.log(username, e);
    return responses.errorResponse(400, e.message);
  }

  try {
    // Authenticate user
    await login(username, password);

    const tokenPayload = {
      username,
    }

    // Issue JWT
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: tokenExpirationTime });

    // Return response
    return responses.successResponseText(200, token);
  } catch (e) {
    console.log(username, e);
    return responses.errorResponse(401, e.message);
  }
};

const getUser = async (username) => {
  const user = await ddb.get({
    TableName: process.env.DbTableName,
    Key: {
      'email': username,
    },
    ProjectionExpression:"first_name, last_name, password",
  }).promise();

  return user;
}

const comparePassword = async (password, userPasswordHash) => {
  const match = await bcrypt.compare(password, userPasswordHash);
  return match;
}

const login = async (username, password) => {
  const user = await getUser(username);
  if (!user || !user.Item) {
    throw new Error('USER_NOT_FOUND'); 
  }

  const isMatch = await comparePassword(password, user.Item.password);
  if (!isMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }

  return true;
}