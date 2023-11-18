const client = require('../../bland.js');

module.exports = {
  name: 'ping',
  aliases: [
    'latency'
  ],
  description: 'Show websocket latency',
  permissions: ['SendMessages'],
  send: false,
  execute(message, args) {
    const ping = Date.now() - message.createdTimestamp;
    let ping1 = [
      `it took \`${ping}ms\` to ping **your mother**`,
      `it took \`${ping}ms\` to ping **the chinese government**`,
      `it took \`${ping}ms\` to ping **lastfms ass computers**`,
      `it took \`${ping}ms\` to ping **my teeshirt**`,
      `it took \`${ping}ms\` to ping **lil mosey**`,
      `it took \`${ping}ms\` to ping **north korea**`,
      `it took \`${ping}ms\` to ping **localhost**`,
      `it took \`${ping}ms\` to ping **twitter**`,
      `it took \`${ping}ms\` to ping **the santos**`,
      `it took \`${ping}ms\` to ping **the trash**`,
      `it took \`${ping}ms\` to ping **a connection to the server**`,
      `it took \`${ping}ms\` to ping **bigoppaa on twitter**`,
      `it took \`${ping}ms\` to ping **6ix9ines ankle monitor**`,
      `it took \`${ping}ms\` to ping **fivem servers**`,
      `it took \`${ping}ms\` to ping **new york**`,
      `it took \`${ping}ms\` to ping **my black airforces**`,
      `it took \`${ping}ms\` to ping **netflix database**`
    ]
    const random = Math.floor(Math.random() * ping1.length);
    message.reply(ping1[random]);
  },
};
