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
var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;


console.log("!!!!!!!!!!!!@@@@@@@@@@@@!!!!!!!!!!!!!@@@@@@@@@@@@@");