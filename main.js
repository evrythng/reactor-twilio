const TwilioClient = require('twilio');

// ------------------------------- Configuration -------------------------------

// Twilio Account SID, Auth Token, and phone number from the Twilio console
const ACCOUNT_SID = '';
const AUTH_TOKEN = '';
const PHONE_NUMBER = '';

const PROPERTY_RULES = [{
  condition: 'temperature_celsius > 100',
  message: {
    to: '',
    body: 'Temperature exceeded acceptable levels!',
  },
}, {
  condition: 'weather_report includes rain',
  message: {
    to: '',
    body: 'Rain is forecast!',
  },
}];

// ---------------------------------- Twilio -----------------------------------

const sendSMS = ({ to, body }) => {
  const client = new TwilioClient(ACCOUNT_SID, AUTH_TOKEN);
  logger.info(`Sending SMS: to=${to} body=${body}`);
  return client.messages.create({ to, from: PHONE_NUMBER, body });
};

// ----------------------------------- Rules -----------------------------------

const runPropertyRule = (rule, propertyValue, onRuleMet) => {
  const tokens = rule.condition.split(' ');
  if (tokens.length !== 3) throw new Error('Invalid rule');

  const [key, condition, ruleValue] = tokens;
  const handlers = {
    '>': n => n > ruleValue,
    '>=': n => n >= ruleValue,
    '==': n => n == ruleValue,
    '<': n => n < ruleValue,
    '<=': n => n <= ruleValue,
    includes: n => `${n}`.includes(ruleValue),
    '!=': n => n != ruleValue,
  };
  if (!handlers[condition]) throw new Error(`Invalid rule condition: ${condition}`);
  if (!handlers[condition](propertyValue)) return Promise.resolve();

  return onRuleMet();
};

const checkPropertyRules = (event) => {
  const update = event.changes;
  return Promise.all(Object.keys(update).map((key) => {
    const rule = PROPERTY_RULES.find(item => item.condition.includes(key));
    if (!rule) return Promise.resolve();

    logger.info(`Running rule ${rule.condition}`);
    return runPropertyRule(rule, update[key].newValue, () => sendSMS(rule.message));
  }));
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

function onThngPropertiesChanged(event) {
  checkPropertyRules(event)
    .then(() => logger.info('Finished checking rules'))
    .catch(err => logger.error(err))
    .then(done);
}
