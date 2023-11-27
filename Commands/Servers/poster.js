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
  subcommands : [
    {
        name : 'poster channel',
        description : 'set the poster channel',
        parameters : [ 'channel' ],
        usage : '(channel)',
        example : '#poster',
        aliases : [ 'set']
    },
    {
        name : 'poster clear',
        description : 'clear the poster channel',
        aliases : [ 'clear', 'remove']
    }
],
  execute(message, args) {
    message.channel.sendTyping();
    const action = args[0].toLowerCase();
    const channel = message.mentions.channels.first();

    if (action === 'channel' || action === 'set') {
      if (!channel) {
        return ctx.warn('Please mention a valid channel.');
      }

      db.set(`pfpchannel_${message.guild.id}`, channel.id);
      ctx.approve(`Poster channel set to ${channel}`);
    } else if (action === 'clear' || action === 'remove') {
      db.delete(`pfpchannel_${message.guild.id}`);
      ctx.approve('Poster channel cleared.');
    } else {
      ctx.warn('Invalid action. `channel` to set a channel or `clear` to clear the channel.');
    }
  },
};
