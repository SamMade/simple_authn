const AWS = require('aws-sdk');
const { hash } = require('bcryptjs');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { successResponse, errorResponse } = require('../../helpers/response');

const hashAsync = promisify(hash);
const randomBytesAsync = promisify(randomBytes);

const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const saltRounds = 10;

const generateData = (password) => {
  const passwordPromise = hashAsync(password, saltRounds);
  const verifyPromise = randomBytesAsync(16).then(o => o.toString('hex'));

  return Promise.all([passwordPromise, verifyPromise]);
};

module.exports.handler = async (event) => {
  try {
    var { email, password, first_name, last_name } = JSON.parse(event.body);
  } catch (e) {
    return errorResponse(400, e.message);
  }

  try {
    const salts = await generateData(password);
    await ddb.put({
      TableName: process.env.DbTableName,
      Item: {
        'email': email,
        'status': 'UNVERIFIED',
        'password': salts[0],
        'first_name' : first_name,
        'last_name' : last_name,
        'verify': salts[1],
        'registered_date': new Date().toISOString(),
      },
      ConditionExpression: "email <> :email",
      ExpressionAttributeValues: {
        ":email" : {S: email}
      }
    }).promise();
  } catch(e) {
    if (e.name === 'ConditionalCheckFailedException') {
      return successResponse(200, {message: "This username isn't allowed."});
    }
    console.log("Error", e);
    return errorResponse(500, e.message);
  }

  // Return response
  return successResponse(201, {message: 'success'});
};