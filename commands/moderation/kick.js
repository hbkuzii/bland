const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kick a user',
  permissions: ['KickMembers'],
  category: "Moderation",
  example: "@user reason",
  usage: "(member) (reason)",
  execute(message, args) {
    if (!args[0]) {
      return;
    }

    const targetUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const targetMember = message.guild.members.cache.get(targetUser.id);

    if (!targetMember) {
      return ctx.warn('The mentioned user is not in the server.');
    }

    if (targetMember.id === message.author.id) {
      return ctx.warn('You cannot kick yourself.');
    }

    if (targetMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return ctx.warn('You cannot kick a person with the administrator permission.');
    }

    const reason = args.slice(1).join(' ') || 'No reason given';

    targetMember.kick(reason)
      .then(() => {
        ctx.approve(`**${targetUser.user.tag}** has been kicked. Reason: ${reason}`);
        message.reply({ embeds: [embed] });
      })
      .catch(err => {
        console.error(err);
        if (err.code === 50013) {
          return ctx.warn(`I do not have the necessary permissions to **${targetMember.user.tag}**.`);
        } else if (err.code === 50051) { 
          return ctx.warn(`I cannot kick ${targetMember.user.tag} due to role hierarchy.`);
        } else {
          ctx.error(`An error occurred while trying to kick the user.`);
        }
      });
  },
};
