const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const client = require('../../bland.js');

module.exports = {
  name: 'avatar',
  aliases: ['av', 'profilepic'],
  description: 'Show user\'s avatar',
  permissions: ['SendMessages'],
  send: false,
  execute(message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => (r.user.username.toLowerCase() === args.join(' ').toLowerCase() || r.displayName.toLowerCase() === args.join(' ').toLowerCase())) || message.member;

    const isAuthor = user.id === message.author.id;

    const avatarEmbed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle(isAuthor ? '> Your avatar' : `> ${user.user.username}'s avatar`)
      .setURL(user.user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setImage(user.user.displayAvatarURL({ dynamic: true, size: 4096 }));

    message.reply({ embeds: [avatarEmbed] });
  },
};
