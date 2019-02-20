const AWS = require('aws-sdk');
const responses = require('../../helpers/response');
const CONSTANTS = require('../../helpers/constants');

const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports.handler = async (event) => {
  try {
    var { verifyID } = event.pathParameters;
  } catch (e) {
    return responses.errorResponse(400, e.message);
  }

  try {
    const vID = await getVerification(verifyID);
    if (!vID || !vID.Items || vID.Items.length === 0) {
      throw new Error('NO_VERIFY'); 
    }
    const email = vID.Items[0].email;
    await setVerification(email);

  } catch(e) {
    if (e.name === 'ValidationException') {
      return responses.errorResponse(404, 'Not Found');
    }
    console.log("Error", e);
    return responses.errorResponse(500, e.message);
  }

  // Return response
  return responses.successResponse(200, {message: 'success'});
};

const getVerification = (id) => {
  console.log(`Find Validation (${id})`);
  return ddb.query({
    TableName: process.env.DbTableName,
    IndexName: "VerifyIndex",
    KeyConditionExpression: "verify = :vid",
    ExpressionAttributeValues: {
        ":vid": id
    },
    ProjectionExpression: "email, account_status",
  }).promise();
}

const setVerification = (email) => {
  console.log(`Update Validation for User (${email})`);
  return ddb.update({
    TableName: process.env.DbTableName,
    Key:{
      'email': email,
    },
    UpdateExpression: `SET account_status = :a, verified_date = :vd`,
    ConditionExpression: "account_status = :uv",
    ExpressionAttributeValues: {
      ":v" : CONSTANTS.ACCOUNT_STATUS.ACTIVE,
      ":vd" : new Date().toISOString(),
      ':uv': CONSTANTS.ACCOUNT_STATUS.UNVERIFIED
    }
  }).promise();
};
