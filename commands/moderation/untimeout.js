const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'untimeout',
  aliases: ['unmute'],
  description: 'Untimeout a user',
  permissions: ['MuteMembers'],
  category: "Moderation",
  example: "@curly",
  usage: "(member)",
  execute(message, args) {
    const untimedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const untimedMember = message.guild.members.cache.get(untimedUser.id);

    if (!untimedMember) {
      return ctx.warn('The mentioned user is not in the server.');
    }

    if (untimedMember.id === message.author.id) {
      return ctx.warn('You cannot untimeout yourself.');
    }

    if (untimedMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return ctx.warn('You cannot untimeout a person with the administrator permission.');
    }
    
    const reason = args.slice(2).join(' ') || 'No reason given';

    untimedMember.timeout(null, reason)
      .then(() => {
        ctx.approve(`**${untimedUser.user}** has been untimed out.`)
        message.reply({ embeds: [embed] });
      })
      .catch(err => {
      });
  },
};
