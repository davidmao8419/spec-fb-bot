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
var CronJob = require('cron').CronJob;
var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;


console.log('Before job instantiation');
const job = new CronJob('0 */10 * * * *', function() {
	const d = new Date();
  console.log('Every Ten Minute:', d);
  //sendMsg(2323593891004265, "Cron testing message");
});
console.log('After job instantiation');
job.start();

function sendMsg(sender_psid, received_message) {
  var response = {
    "text": received_message
  }
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
    "qs": { "access_token": FB_PAGE_TOKEN },
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