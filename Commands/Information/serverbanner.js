const { EmbedBuilder } = require('discord.js');
const config = require("../../config.json")

module.exports = {
  name: "serverbanner",
  aliases: ["sb", "sbanner"],
  category: 'Information',
  description: 'Get the server banner',
  send: false,
  permissions: ['SendMessages'],
  async execute(message) {
    let banner = message.guild.bannerURL({ dynamic: true, format: "png", size: 2048 });

    if (banner) {
      const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(`${message.guild.name}'s server banner`)
         .setURL(banner)
        .setImage(banner)


      message.channel.send({ embeds: [embed] });
    } else {
      ctx.warn("This server does not have a banner.");
    }
  }
}
