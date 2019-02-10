'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server
  //request = require('request');

  const BootBot = require('bootbot');

  const bot = new BootBot({
    accessToken: 'EAAFV6q1mQZCIBAM47amsXEMuXEUPZAwHu33QcYYS1VOqfkWC2AZCKOWtLPnKyqLzfqYdpP1bU9ewMQqmkOpd7LzShufjIwAKhCmOyHIp34zyIhqY3P2THpqd2QtRlOL2ZBK6oANZCoQI9YkwpeJatcZBogGeoSFYRKbL1KfkjJa1chhZCM4Kihz',
    verifyToken: 'testing',
    appSecret: '1076a355abf1df7533250276d151be84'
  });
//require('./bot');
// Sets server port and logs message on success
//app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.listen(process.env.PORT || 1337, () => bot.start());

bot.hear('hello', (payload, chat) => {
    console.log("??????????????????????????????@@@@");
    chat.getUserProfile().then((user) => {
      chat.say(`Hello, ${user.first_name}!`);
    });
});

bot.on('message', (payload, chat) => {
  const text = payload.message.text;
  console.log("??????????????????????????????");
  chat.say(`Echo: ${text}`);

});

//bot.start();

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        //console.log(webhook_event);
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
        /*
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
          } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
          }
          */
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });




  // Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "testing"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
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