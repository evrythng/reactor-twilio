const TwilioClient = require('twilio');

const sendSMS = ({ to, from, body }) => {
  const { accountSid, authToken } = app.customFields;
  if (!accountSid || !authToken) throw new Error('accountSid or authToken customField not defined');
  
  const client = new TwilioClient(accountSid, authToken);
  logger.info(`from=${from} to=${to} body=${body}`);
  return client.messages.create({ to, from, body });
};

// @filter(onActionCreated) action.type=_sendSMS
function onActionCreated(event) {
  app.$init
    .then(() => sendSMS(event.action.customFields))
    .then(message => logger.info(`message.id=${message.sid}`))
    .catch(err => logger.error(err))
    .then(done);
}
