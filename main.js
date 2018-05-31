const TwilioClient = require('twilio');

// ------------------------------- Configuration -------------------------------

// Twilio Account SID, Auth Token, and phone number from the Twilio console
const ACCOUNT_SID = '';
const AUTH_TOKEN = '';
const PHONE_NUMBER = '';

// ---------------------------------- Twilio -----------------------------------

const client = new TwilioClient(ACCOUNT_SID, AUTH_TOKEN);

const sendSMS = ({ to, body }) => {
  logger.info(`Sending SMS: to=${to} body=${body}`);
  return client.messages.create({ to, from: PHONE_NUMBER, body });
};

// ------------------------------- Reactor Events ------------------------------

// @filter(onActionCreated) action.type=_sendSMS
function onActionCreated(event) {
  app.$init
    .then(() => sendSMS(event.action.customFields))
    .then(message => logger.info(`message.id=${message.sid}`))
    .catch(err => logger.error(err))
    .then(done);
}
