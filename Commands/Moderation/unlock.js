const { Permissions } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'unlock',
  aliases: ['unlockchannel'],
  description: 'Unlock the channel to prevent messages from being sent',
  permissions: ['ManageChannels'],
  category: 'Moderation',
  send: false,
  execute(message, args, client) {
    const channel = message.mentions.channels.first() || message.channel;

    if (channel.permissionsFor(message.guild.roles.everyone).has('SendMessages') === true) {
        return ctx.warn(`${channel} is already unlocked.`);
      }
  
    channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: true })
      .then(() => {
        ctx.embed(`${channel} channel has been unlocked.`);
      })
      .catch((error) => {
        console.error(error);
        ctx.error();
      });
  }
}
