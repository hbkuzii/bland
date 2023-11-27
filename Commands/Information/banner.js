const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const client = require('../../bland.js');

module.exports = {
  name: 'banner',
  aliases: ['userbanner'],
  description: 'Show user\'s banner',
  permissions: ['SendMessages'],
  category: 'Information',
  send: false,
  execute(message, args, client) {
    message.channel.sendTyping();
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => (r.user.username.toLowerCase() === args.join(' ').toLowerCase() || r.displayName.toLowerCase() === args.join(' ').toLowerCase())) || message.member;

    if (!user) {
      ctx.normal("User not found!");
      return;
    }

    const bannerEmbed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle(`> ${user.user.username}'s banner`)
      .setImage(`https://cdn.discordapp.com/banners/${user.id}/${user.user.banner}.gif?size=4096`);
      console.log(`https://cdn.discordapp.com/banners/${user.id}/${user.user.banner}.gif?size=4096`)
    message.reply({ embeds: [bannerEmbed] });
  },
};
