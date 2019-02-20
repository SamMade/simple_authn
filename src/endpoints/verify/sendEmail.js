const AWS = require("aws-sdk");

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

/**
 * Event Parameters required:
 * name
 * email
 * verifyCode
 */
module.exports.handler = async (event) => {
  console.log('Handling confirmation email to', event);

  try {
    var { email, name, verifyCode } = event;
  } catch (e) {
    console.log(e);
    return new Error('INVALID_INPUT');
  }
  
  if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    console.log('Not sending: invalid email address', email);
    return new Error('INVALID_EMAIL');
  }

  const VERIFICATION_LINK = verifyCode;
  const SITE_NAME = process.env.SiteName;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <p>Hi ${name},</p>
        <p>Thank you for creating an account for ${SITE_NAME}.<br/>
        To complete registration, click the link below to validate your account:</p>
        <p>${VERIFICATION_LINK}</p>
      </body>
    </html>
  `;

  const textBody = `
    Hi ${name},
    Thank you for creating an account for ${SITE_NAME}.
    To complete registration, click the link below to validate your account:

    ${VERIFICATION_LINK}

  `;

  // Create sendEmail params
  const params = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Thanks for registering with ${SITE_NAME}!`
      }
    },
    Source: `DO-NOT-REPLY@${process.env.SupportEmailDomain}`
  };

  // Create the promise and SES service object
  const sendMessage = await ses.sendEmail(params).promise();
  console.log(sendMessage.MessageId);
  return "Success";
};