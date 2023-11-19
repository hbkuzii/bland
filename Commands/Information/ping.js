const client = require('../../bland.js');

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
      `it took \`${ping}ms\` to ping **netflix database**`,
      `it took \`${ping}ms\` to ping **your cat**`,
      `it took \`${ping}ms\` to ping **the moon**`,
      `it took \`${ping}ms\` to ping **Elon Musk's Tesla in space**`,
      `it took \`${ping}ms\` to ping **the Bermuda Triangle**`,
      `it took \`${ping}ms\` to ping **the Matrix**`,
      `it took \`${ping}ms\` to ping **Mars rover**`,
      `it took \`${ping}ms\` to ping **Atlantis**`,
      `it took \`${ping}ms\` to ping **Area 51**`,
      `it took \`${ping}ms\` to ping **the Loch Ness Monster**`,
      `it took \`${ping}ms\` to ping **my grandma's cookies**`,
      `it took \`${ping}ms\` to ping **the International Space Station**`,
      `it took \`${ping}ms\` to ping **Santa Claus' workshop**`,
      `it took \`${ping}ms\` to ping **the Great Wall of China**`,
      `it took \`${ping}ms\` to ping **the center of the Earth**`,
      `it took \`${ping}ms\` to ping **a parallel universe**`,
      `it took \`${ping}ms\` to ping **the lost city of Atlantis**`,
      `it took \`${ping}ms\` to ping **the edge of the universe**`,
      `it took \`${ping}ms\` to ping **my favorite TV show's script**`      
    ]
    const random = Math.floor(Math.random() * ping1.length);
    message.reply(ping1[random]);
  },
};
