const config = require('../../config.json');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "userbanner",
  aliases: ['banner', 'ub'],
  category: "Information",
  description: "Get user banner",
  usage: "(member)",
  example: "@curly",
  send: false,
  async execute(message, args, client) {
    message.channel.sendTyping();

    let mentionedMember = message.mentions.members.first() || 
      message.guild.members.cache.get(args[0]) || 
      message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || 
      message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || 
      message.member;

    let user = await client.users.fetch(mentionedMember.id).catch(() => null);
    if (!user) user = message.author;

    let uid = user.id;
    let response = await fetch(`https://discord.com/api/v8/users/${uid}`, {
      method: 'GET',
      headers: {
        Authorization: `Bot ${config.token}`
      }
    });

    let banner = 'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif';

    if (response.status !== 404) {
      let data = await response.json();
      let receive = data['banner'];

      if (receive !== null) {
        let response2 = await fetch(`https://cdn.discordapp.com/banners/${uid}/${receive}.gif`, {
          method: 'GET',
          headers: {
            Authorization: `Bot ${config.token}`
          }
        });

        let statut = response2.status;

        if (statut === 415) {
          banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.png?size=1024`;
        } else {
          banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.gif?size=1024`;
        }
      }
    }

    let embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle(user === message.author ? "Your banner" : `${user.username}'s banner`);

    if (banner !== 'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif') {
      embed.setImage(banner).setURL(banner);
    } else {
      const noBannerMessage = user === message.author ? "You don't have a banner." : `**${user.username}**: doesn't have a banner.`;
      return message.channel.send(noBannerMessage);
    }

    message.channel.send({ embeds: [embed] });
  },
};
