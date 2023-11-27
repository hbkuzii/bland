const { charToHex } = require('discord-emojis-parser');

module.exports = {
  name: 'ping',
  aliases: [
    'latency'
  ],
  description: 'Show websocket latency',
  permissions: ['SendMessages'],
  send: false,
  category: 'Information',
  execute(message, args, client) {
    message.channel.sendTyping();
      ctx.send(`${client.ws.ping}ms`);
  },
};
