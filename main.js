const TwilioClient = require('twilio');

const sendSMS = (action) => {
  // Application customFields must contain Twilio credentials
  const { accountSid, authToken } = app.customFields;
  if (!accountSid || !authToken) throw new Error('accountSid or authToken customField not defined');
  
  const client = new TwilioClient(accountSid, authToken);
  
  // Action customFields must contain message { to, from, body }
  const { to, from, body } = action.customFields;
  logger.info(`from=${from} to=${to} body=${body}`);
  return client.messages.create({ to, from, body });
};

// @filter(onActionCreated) action.type=_sendSMS
function onActionCreated(event) {
  app.$init
    .then(() => sendSMS(event.action))
    .then(message => logger.info(`message.id=${message.sid}`))
    .catch(err => logger.error(err))
    .then(done);
}
