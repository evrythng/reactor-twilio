# reactor-twilio

Reusable script for the [EVRYTHNG Reactor](https://developers.evrythng.com/reference#reactor) that
allows sending of SMS messages through the [`twilio`](https://github.com/twilio/twilio-node) NPM
module.

The script itself requires only minimal changes - your Twilio Account SID, Auth Token, and Phone
Number (available from the [Twilio console](https://www.twilio.com/console)). Once it is set up,
creating an action of a specific type with the message details embedded within the action will cause
Twilio to send an SMS.


## Installation

1. Open the [Dashboard](https://dashboard.evrythng.com) and create a project and application.
2. Paste `main.js` from this repository as the application's Reactor script on the application page.
3. Click 'Show dependencies' and set the `dependencies` in `package.json`.
4. Save the new script using the 'Update' button.
5. Create an action type called `_sendSMS` within the same project.


## Configuration

1. Obtain your Account SID, Auth Token, and phone number from the
   [Twilio console](https://www.twilio.com/console).
2. Insert these in the installed Reactor script as `ACCOUNT_SID`, `AUTH_TOKEN`, and `PHONE_NUMBER`.


## Usage

The script will send an SMS message when an EVRYTHNG action is created in the scope of
the project of the `_sendSMS` type with the correct `customFields`:

* `customFields.to` - The recipient SMS number.
* `customFields.body` - The content of the SMS message.

Test by sending an HTTP request:

```
POST /actions/_sendSMS
Content-Type: application/json
Authorization: $OPERATOR_API_KEY

{
  "type": "_sendSMS",
  "thng": "U4MhAkdaVD8atKwRaE4CVrYh",
  "customFields": {
    "to": "+447865784352",
    "message": "Hello from the EVRYTHNG Reactor!"
  }
}
```


## Use with Rules

A useful extension of this capability can be created by also deploying the
[`reactor-rules`](https://github.com/evrythng/reactor-rules) Reactor script to
allow sending of SMS messages when Thng properties meet certain conditions.

For example, when the `temperature_celsius` property exceeds a threshold the
following rule could be set which would trigger this script to send an SMS:

```js
{
  when: 'temperature_celsius > 100',
  create: [{
    action: {
      type: '_sendSMS',
      customFields: {
        to: '+447865784352',
        message: 'Temperature exceeded acceptable levels!'
      }
    }
  }]
}
```
