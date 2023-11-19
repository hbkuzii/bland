const db = require('quick.db');

module.exports = {
  name: "poster",
  aliases: ['autopfp'],
  permissions: ['ManageGuild'],
  description: 'Set up automatic avatar posting',
  usage: "(subcommand) <args>",
  example: "channel #pictures",
  category: 'Servers',
  parameters: ['\`channel\`'],
  subcommands: '\`poster channel\` - set the poster channel\n\`poster clear\` - clear the poster channel',
  execute(message, args) {
    message.channel.sendTyping();
    const action = args[0].toLowerCase();
    const channel = message.mentions.channels.first();

    if (action === 'channel') {
      if (!channel) {
        return ctx.warn('Please mention a valid channel.');
      }

      db.set(`pfpchannel_${message.guild.id}`, channel.id);
      ctx.approve(`Poster channel set to ${channel}`);
    } else if (action === 'clear') {
      db.delete(`pfpchannel_${message.guild.id}`);
      ctx.approve('Poster channel cleared.');
    } else {
      ctx.warn('Invalid action. Use `channel` to set a channel or `clear` to clear the channel.');
    }
  },
};
