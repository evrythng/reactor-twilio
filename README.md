# reactor-twilio

Example script for the [EVRYTHNG Reactor](https://developers.evrythng.com/reference#reactor) that 
allows sending of SMS messages through the [`twilio`](https://github.com/twilio/twilio-node) NPM 
module. 

The script itself requires no changes as part of deployment, as all configuration is done
via EVRYTHNG Platform resources. Once it is set up, creating an action of a specific type with the 
message details embedded within the action will cause Twilio to send an SMS.


## Installation

1. Open the [Dashboard](https://dashboard.evrythng.com) and create a project and application.
2. Paste `main.js` from this repository as the application's Reactor script on the application page.
3. Click 'Show dependencies' and set the `dependencies` in `package.json`.
4. Save the new script using the 'Update' button.
5. Create an action type called `_sendSMS` within the same project.


## Configuration

1. Obtain your Account SID and Auth Token from the [Twilio console](https://www.twilio.com/console).
2. Set these on the chosen EVRYTHNG application's `customFields` as `accountSid` and `authToken`.


## Send an SMS

Once the Reactor script is installed, and the application updated with Twilio credentials, sending
an SMS through EVRYTHNG is simply a matter of creating an action with the message details:

* `customFields.to` - The recipient SMS number.
* `customFields.from` - Your chosen Twilio phone number, set up through the Twilio console.
* `customFields.body` - The content of the SMS message.

At the moment, the script sends an SMS message when an EVRYTHNG action is created in the scope of 
the project. In a more advanced integration, an action created when some condition is reached in a 
Thng property, or on a 
[Reactor schedule](https://developers.evrythng.com/reference#section-reactor-scheduler-api) can be 
used.

Test by sending an HTTP request:

```
POST /actions/_sendSMS
Content-Type: application/json

{
  "type": "_sendSMS",
  "thng": "U4MhAkdaVD8atKwRaE4CVrYh",
  "customFields": {
    "to": "+447865784352",
    "from": "+441246334321",
    "message": "Hello from the EVRYTHNG Reactor!"
  }
}
```
