const { charToHex } = require('discord-emojis-parser');
const bland = require('../../bland.js');

module.exports = {
  name: 'ping',
  aliases: [
    'latency'
  ],
  description: 'Show websocket latency',
  permissions: ['SendMessages'],
  send: false,
  category: 'Information',
  execute(message, args) {
    message.channel.sendTyping();
      ctx.send(`${clientping}`);
  },
};
