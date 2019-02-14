'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

const {google} = require('googleapis');
const request = require('request');
const BootBot = require('bootbot');

  const bot = new BootBot({
    accessToken: 'EAAFV6q1mQZCIBAM47amsXEMuXEUPZAwHu33QcYYS1VOqfkWC2AZCKOWtLPnKyqLzfqYdpP1bU9ewMQqmkOpd7LzShufjIwAKhCmOyHIp34zyIhqY3P2THpqd2QtRlOL2ZBK6oANZCoQI9YkwpeJatcZBogGeoSFYRKbL1KfkjJa1chhZCM4Kihz',
    verifyToken: 'testing',
    appSecret: '1076a355abf1df7533250276d151be84'
  });
  //bot.start()
//require('./bot');
// Sets server port and logs message on success

//app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.listen(process.env.PORT || 1337, () => greeting());

bot.on('message', (payload, chat) => {
    console.log('A text message was received!');
  });

// Creates the endpoint for our webhook 
app.post('./get_started', (req, res) => {
  console.log("helooooooooooo");
});
app.post('/webhook', (req, res) => {  

    let body = req.body;
    // Checks this is an event from a page subscription
    console.log("!!!!!!! ", body.object);
    if (body.object === 'page') {
      console.log(body);
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        let sender_psid = webhook_event.sender.id;
        //console.log('Sender PSID: ' + sender_psid);
        
        //greeting(sender_psid)
        
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
          } else if (webhook_event.postback) {
            console.log("Helloooooo your ID is ", sender_psid);
            //handlePostback(sender_psid, webhook_event.postback);
          }
        
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  });
  
  /*
  function linkToGoogleCalendar() {
    //https://fbbot-davidmao.herokuapp.com/
  }
*/
  function greeting() {
    let request_body = {
      
      "greeting": [
        {"locale":"default",
        "text":"Welcome!!! When you click the start button, you can connect to your Google Calendar!!"}
      ],
      "get_started":{
        "payload":"Click here to link to your Google Calendar!!"
      }
    }
    request({
      "uri": "https://graph.facebook.com/v2.6/me/messenger_profile",
      "qs": { "access_token": "EAAFV6q1mQZCIBAF41HvSEsqaQvqOtu5g3Ne9QNWbFBTjZCoKPWVuursrAsOMBYp05i4NeZCXKWcOwx1DZB0nuHn0jJH7eDqIUAxvS9SEX14q1RN7fGZAgxebKY0DS6r2s9sMkMmbJ6SsrsINDHmrb5EFWBlvWCWWXkvkXwZCZA33BmeXZANWEV6Yu9XAKlBhJElORaHC5eyO0AZDZD" },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('HELLOOOOOo  message sent!')
      } else {
        console.error("HELOOOOOOO Unable to send message:" + err);
      }
    }); 
  }

  function handleMessage(sender_psid, received_message) {

    let response;
  
    // Check if the message contains text
    if (received_message.text) {    
  
      // Create the payload for a basic text message
      response = {
        "text": `You sent the message: "${received_message.text}". Now send me an image!`
      }
      response = {
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":"Connect to Google Calendar!",
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://www.messenger.com/",
                  "title":"Connect!!",
                  "webview_height_ratio": "full"
                }
              ]
            }
          }
        }
    }  
    
    // Sends the response message
    console.log("!! The response will be ", response);
    callSendAPI(sender_psid, response);    
  }

  function callSendAPI(sender_psid, response) {

    // Construct the message body
    let request_body = {
        "recipient": {
        "id": sender_psid
        },
        "message": response
        //messaging_type: 'RESPONSE'
    }

    // Send the HTTP request to the Messenger Platform
    request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": "EAAFV6q1mQZCIBAF41HvSEsqaQvqOtu5g3Ne9QNWbFBTjZCoKPWVuursrAsOMBYp05i4NeZCXKWcOwx1DZB0nuHn0jJH7eDqIUAxvS9SEX14q1RN7fGZAgxebKY0DS6r2s9sMkMmbJ6SsrsINDHmrb5EFWBlvWCWWXkvkXwZCZA33BmeXZANWEV6Yu9XAKlBhJElORaHC5eyO0AZDZD" },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('message sent!')
      } else {
        console.error("Unable to send message:" + err);
      }
    }); 
  }

  // Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "testing"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    console.log("HELOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });
  