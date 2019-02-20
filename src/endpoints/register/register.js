const AWS = require('aws-sdk');
const { hash } = require('bcryptjs');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const responses = require('../../helpers/response');
const CONSTANTS = require('../../helpers/constants');

const hashAsync = promisify(hash);
const randomBytesAsync = promisify(randomBytes);

const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const saltRounds = 10;

module.exports.handler = async (event) => {
  try {
    var { email, password, first_name, last_name } = JSON.parse(event.body);
  } catch (e) {
    return responses.errorResponse(400, e.message);
  }

  try {
    const salts = await generateData(password);
    
    await saveRegistration({
      email,
      password: salts[0],
      verifyCode: salts[1],
      first_name,
      last_name,
    });

    await invokeEmail({
      email,
      name: first_name,
      verifyCode: salts[1]
    })
  } catch(e) {
    if (e.name === 'ConditionalCheckFailedException') {
      return responses.successResponse(200, {message: "This username isn't allowed."});
    }
    console.log("Error", e);
    return responses.errorResponse(500, e.message);
  }

  // Return response
  return responses.successResponse(201, {message: 'success'});
};

const generateData = (password) => {
  const passwordPromise = hashAsync(password, saltRounds);
  const verifyPromise = randomBytesAsync(16).then(o => o.toString('hex'));

  return Promise.all([passwordPromise, verifyPromise]);
};

const saveRegistration = (user) => {
  console.log(`Save User (${user.email}) to DB`);
  return ddb.put({
    TableName: process.env.DbTableName,
    Item: {
      'email': user.email,
      'account_status': CONSTANTS.ACCOUNT_STATUS.UNVERIFIED,
      'password': user.password,
      'first_name' : user.first_name,
      'last_name' : user.last_name,
      'verify': user.verifyCode,
      'registered_date': new Date().toISOString(),
    },
    ConditionExpression: "email <> :email",
    ExpressionAttributeValues: {
      ":email" : user.email
    }
  }).promise();
};

/**
 * Invokes the lambda that sends an email
 * @param {*} event 
 */
const invokeEmail = (event) => {
  console.log('Invoke Email')
  return lambda.invoke({
    FunctionName: process.env.VerifySendEmailLambda,
    InvocationType: "Event",
    Payload: JSON.stringify(event)
  }).promise();
};
