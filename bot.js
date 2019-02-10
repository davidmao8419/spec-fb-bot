'use strict';
const BootBot = require('bootbot');

const bot = new BootBot({
  accessToken: 'EAAFV6q1mQZCIBAM47amsXEMuXEUPZAwHu33QcYYS1VOqfkWC2AZCKOWtLPnKyqLzfqYdpP1bU9ewMQqmkOpd7LzShufjIwAKhCmOyHIp34zyIhqY3P2THpqd2QtRlOL2ZBK6oANZCoQI9YkwpeJatcZBogGeoSFYRKbL1KfkjJa1chhZCM4Kihz',
  verifyToken: 'testing',
  appSecret: '1076a355abf1df7533250276d151be84'
});

bot.on('message', (payload, chat) => {
  const text = payload.message.text;
  chat.say(`Echo: ${text}`);
});

bot.start();