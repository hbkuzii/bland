const { EmbedBuilder } = require('discord.js');
const config = require("../../config.json")

module.exports = {
  name: "servericon",
  aliases: ["sicon", "guildbanner"],
  category: 'Information',
  description: 'Get the server banner',
  send: false,
  permissions: ['SendMessages'],
  async execute(message) {
    let icon = message.guild.iconURL({ dynamic: true, format: "png", size: 2048 });

    if (icon) {
      const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(`${message.guild.name}'s server icon`)
         .setURL(icon)
        .setImage(icon)


      message.channel.send({ embeds: [embed] });
    } else {
      ctx.warn("This server does not have a icon.");
    }
  }
}
