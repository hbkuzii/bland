const { Permissions } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'lock',
  aliases: ['lockchannel'],
  description: 'Locks the mentioned channel or the current channel',
  permissions: ['ManageChannels'],
  category: 'Moderation',
  send: false,
  execute(message, args, client) {
    const channel = message.mentions.channels.first() || message.channel;

    if (channel.permissionsFor(message.guild.roles.everyone).has('SendMessages') === false) {
      return ctx.warn(`${channel} is already locked.`);
    }

    channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false })
      .then(() => {
        ctx.embed(`${channel} channel has been locked.`);
      })
      .catch((error) => {
        console.error(error);
        ctx.error();
      });
  }
};
