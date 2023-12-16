const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: 'kick',
    aliases: ['boot', 'k'],
    description: 'Kick a user from the server',
    permissions: ['KickMembers'],
    category: 'Moderation',
    usage: '(member) (reason)',
    async execute(message, args, client) {
      message.channel.sendTyping();
  
      const targetUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  
      if (!targetUser) {
        return message.channel.send('User not found. Please mention a valid user or provide a valid user ID.');
      }
  
      if (targetUser.id === message.author.id) {
        return ctx.warn('You cannot kick yourself.');
      }
  
      const reason = args.slice(1).join(' ') || 'No reason given';
  
      const embed = new EmbedBuilder()
        .setTitle('**Kicked**')
        .setDescription(`> You've been kicked from ${message.guild.name}`)
        .addFields({ name: `**Moderator**`, value: `${message.author.tag}`, inline: true })
        .addFields({ name: `**Reason**`, value: `${reason}`, inline: true })
        .setColor(config.color)
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) });
  
      targetUser.send({ embeds: [embed] })
        .then(() => {
          targetUser.kick(reason)
            .then(() => {
              message.reply({ embeds: [{ color: config.color, description: `> **${targetUser.user.tag}** has been kicked. Reason: ${reason}` }] });
            })
            .catch(err => {
              console.error(err);
              if (err.code === 50013) {
                return message.reply({ embeds: [{ color: config.color, description: `> I do not have the necessary permissions to kick **${targetUser.user.tag}**.` }] });
              } else if (err.code === 50051) {
                return message.reply({ embeds: [{ color: config.color, description: `> I cannot kick **${targetUser.user.tag}** due to role hierarchy.` }] });
              } else {
                ctx.error();
              }
            });
        });
    },
  };