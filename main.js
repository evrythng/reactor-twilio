const TwilioClient = require('twilio');


// ------------------------------- Configuration -------------------------------

// Twilio Account SID, Auth Token, and phone number from the Twilio console
const ACCOUNT_SID = '';
const AUTH_TOKEN = '';
const PHONE_NUMBER = '';

const PROPERTY_RULES = [{
  condition: 'temperature_celsius > 0',
  message: {
    to: '+447793248002',
    body: 'Temperature exceeded acceptable levels!'
  }
}, {
  condition: 'weather_report includes rain',
  message: {
    to: '+447793248002',
    body: 'Rain is forecast!'
  }
}];


// ---------------------------------- Twilio -----------------------------------

const sendSMS = ({ to, body }) => {
  const client = new TwilioClient(ACCOUNT_SID, AUTH_TOKEN);
  
  logger.info(`Sending SMS: to=${to} body=${body}`);
  return client.messages.create({ to, from: PHONE_NUMBER, body });
};


// ----------------------------------- Rules -----------------------------------

const CONDITION_NUM_SECTIONS = 3;

const runRule = (rule, update) => {
  const sections = rule.condition.split(' ');
  if (sections.length !== CONDITION_NUM_SECTIONS) throw new Error('Invalid rule');
  if (update.newValue === update.oldValue) return Promise.resolve();

  const [key, condition, ruleValue] = sections;
  const handlers = {
    '>': val => val > ruleValue,
    '>=': val => val >= ruleValue,
    '==': val => val == ruleValue,
    '<': val => val < ruleValue,
    '<=': val => val <= ruleValue,
    'includes': val => `${val}`.includes(ruleValue),
    '!=': val => val != ruleValue
  };
  if (!handlers[condition]) throw new Error(`Invalid rule condition: ${condition}`);
  if(!handlers[condition](update.newValue)) return Promise.resolve();

  return sendSMS(rule.message);
};

const checkRules = (event) => {
  const update = event.changes;
  const updatedKeys = Object.keys(update);
  const promises = updatedKeys.map((key) => {
    const rule = PROPERTY_RULES.find(rule => rule.condition.includes(key));
    if (!rule) return Promise.resolve();

    logger.info(`Running rule ${rule.condition}`);
    return runRule(rule, update[key]);
  });
  return Promise.all(promises);
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
  checkRules(event)
    .then(() => logger.info('Finished checking rules'))
    .catch(err => logger.error(err))
    .then(done);
}
