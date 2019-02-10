'use strict';
const BootBot = require('bootbot');

const bot = new BootBot({
  accessToken: 'EAAFV6q1mQZCIBADaV5FCP43ih9c3ZAtjDa8dHE81AlyDsF9ZCd2ycoDJn24ahaZBziyZCeaC491HagfsaKYBcwhWM3xgoquj8mqHh2O2WgyHuUsaHSWdHothSuZAHZCF9vkxDsGW3obalp3gHZCVrOdZAIZBmkF2I5GOydPZClntCXivJ0ouZAMJrxGOFAZBsLOxvy1pLMwSN6WTUGAZDZD',
  verifyToken: 'testing',
  appSecret: '1076a355abf1df7533250276d151be84'
});

bot.on('message', (payload, chat) => {
  const text = payload.message.text;
  console.log("??????????????????????????????");
  //chat.say(`Echo: ${text}`);

});

bot.start();