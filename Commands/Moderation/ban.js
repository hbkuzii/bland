const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ban',
  aliases: ['b'],
  description: 'Ban a user',
  permissions: ['BanMembers'],
  category: 'Moderation',
  example: 'curly reason',
  usage: '(member) <reason>',
  execute(message, args) {
    let targetUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!targetUser) {
      const username = args.join(' ').toLowerCase();
      const foundMember = message.guild.members.cache.find((member) =>
        member.user.username.toLowerCase() === username ||
        member.displayName.toLowerCase() === username
      );

      if (foundMember) {
        targetUser = foundMember;
      } else {
        return ctx.warn('User not found. Please mention a valid user or provide a valid user ID.');
      }
    }

    const targetMember = message.guild.members.cache.get(targetUser.id);

    if (!targetMember) {
      return ctx.warn('The mentioned user is not in the server.');
    }

    if (targetMember.id === message.author.id) {
      return ctx.warn('You cannot ban yourself.');
    }

    if (targetMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return ctx.warn('You cannot ban a person with the administrator permission.');
    }

    const reason = args.slice(1).join(' ') || 'No reason given';

    const embed = new EmbedBuilder()
      .setTitle('**Banned**')
      .setDescription(`> You've been banned from ${message.guild.name}`)
      .addFields({ name: `**Moderator**`, value: `${message.author.tag}`, inline: true })
      .addFields({ name: `**Reason**`, value: `${reason}`, inline: true })
      .setColor('#ff0000')
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) });

    targetUser.send({ embeds: [embed] })
      .then(() => {
        targetMember.ban({ reason, days: 7 })
          .then(() => {
            ctx.approve(`**${targetUser.user.tag}** has been banned. Reason: ${reason}`);
          })
          .catch(err => {
            console.error(err);
            if (err.code === 50013) {
              return ctx.warn(`I do not have the necessary permissions to **${targetMember.user.tag}**.`);
            } else if (err.code === 50051) {
              return ctx.warn(`I cannot ban ${targetMember.user.tag} due to role hierarchy.`);
            } else {
              ctx.warn(`An error occurred while trying to ban the user.`);
            }
          });
      })
      .catch(err => {
        console.error(`Failed to send DM: ${err}`);
        ctx.warn(`An error occurred while trying to send a DM to the user.`);
      });
  },
};
