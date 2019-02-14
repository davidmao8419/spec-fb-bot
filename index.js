'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

const {google} = require('googleapis');
var {User} = require('./models');
const request = require('request');
const BootBot = require('bootbot');
var facebookID;
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

  const bot = new BootBot({
    accessToken: 'EAAFV6q1mQZCIBAM47amsXEMuXEUPZAwHu33QcYYS1VOqfkWC2AZCKOWtLPnKyqLzfqYdpP1bU9ewMQqmkOpd7LzShufjIwAKhCmOyHIp34zyIhqY3P2THpqd2QtRlOL2ZBK6oANZCoQI9YkwpeJatcZBogGeoSFYRKbL1KfkjJa1chhZCM4Kihz',
    verifyToken: 'testing',
    appSecret: '1076a355abf1df7533250276d151be84'
  });

//app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.listen(process.env.PORT || 1337, () => greeting());

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
        
        //TODO: to see whether the user already connects to the google calendar
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
          } else if (webhook_event.postback) {
            handleMessage(sender_psid, webhook_event.message);  
            //console.log("Helloooooo your ID is ", sender_psid);
            //linkToGoogleCalendar(sender_psid);
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
  
  app.get('/oauth', function(req, res){
    // ** create an oAuth client to authorize the API call.
    console.log("redirection got");
    let oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.DOMAIN + '/connect/callback'
    )
    // ** Generate the url that will be used for the consent dialog.
    let url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'email',
            'https://www.googleapis.com/auth/calendar'
        ],
        state: encodeURIComponent(JSON.stringify({
            auth_id: req.query.auth_id
        }))
    });
    facebookID = req.query.auth_id;
    res.redirect(url);
})

app.get('/connect/callback', function(req, res) {
  const code = req.query.code;
  let oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.DOMAIN + '/connect/callback'
  )
  oauth2Client.getToken(code, function (err, tokens){
    if(err) {
      console.log(err);
    } else {
      oauth2Client.setCredentials(tokens);
      var plus = google.plus('v1');
      plus.people.get({auth: oauth2Client, userId: 'me'}, function(err, person){
        if(err) {
          console.log(err);
        } else {
          console.log("this is googleplus person object", person);
          var tempEmail = person.data.emails[0].value;
          let auth_id = JSON.parse(decodeURIComponent(req.query.state));
          var newUser = new User({
            token: tokens,
            //facebookID: facebookID, //TODO: ALSO store slackname so that you can easily add your own meetings to your calendars too
            auth_id: auth_id.auth_id,
            email: tempEmail,
            pendingInvites: []
        });
        newUser.save()
                    .then( () => {
                        res.status(200).send("Your account was successfuly authenticated");
                        linkSuccessMessage(auth_id.auth_id, "You successfully connect to Google Calendar! Now I will remind you 7am everyday!");
                        //rtm.sendMessage("You've successfully connect to your Google calendar", channelID)
                    })
                    .catch((err) => {
                        console.log('error in newuser save of connectcallback');
                        res.status(400).json({error:err});
                    });
          console.log("!!!!!!! facebookID: ", facebookID);
          console.log("!!!!!!! auth_id: ", auth_id.auth_id);
        }
      });
    }
  });
})

  function linkToGoogleCalendar(sender_psid) {
    //https://fbbot-davidmao.herokuapp.com/
    request({
      "uri": "https://fbbot-davidmao.herokuapp.com/oauth",
      "qs": { "auth_id": sender_psid },
      "method": "POST"
    }, (err, res, body) => {
      if (!err) {
        
        //console.log('link to google calendar success')
      } else {
        console.error("google calendar " + err);
      }
    }); 
  }

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
      "qs": { "access_token": "EAAFV6q1mQZCIBAA8gCUhqCfIZAh960xQzIUsLlDMD1i2a5YnZACJe1ZCF6RMlxRv42gOlasMVgf6jZBI3rEYagOPqQSKjpEjxO7UYePSZBSsrtlCCTliZA3YISYbUqCHQTFx8yPwV2IU9IzQp4xumMTmA3uZAxiJW2EZALBT8vppCKPJSebjP4JRZA" },
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

  function linkSuccessMessage(sender_psid, received_message) {
    var response = {
      "text": received_message
    }
    callSendAPI(sender_psid, response);
  }

  function handleMessage(sender_psid, received_message) {

    let response;
    let url = 'https://fbbot-davidmao.herokuapp.com/oauth?auth_id='+sender_psid;
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
              "text":"Connect to Google Calendar! Then I will nudge every morning at 7am.",
              "buttons":[
                {
                  "type":"web_url",
                  "url": url,
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
      "qs": { "access_token": "EAAFV6q1mQZCIBAA8gCUhqCfIZAh960xQzIUsLlDMD1i2a5YnZACJe1ZCF6RMlxRv42gOlasMVgf6jZBI3rEYagOPqQSKjpEjxO7UYePSZBSsrtlCCTliZA3YISYbUqCHQTFx8yPwV2IU9IzQp4xumMTmA3uZAxiJW2EZALBT8vppCKPJSebjP4JRZA" },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('message sent!!!')
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
  