const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const client = require('../../bland.js');

module.exports = {
  name: 'botinfo',
  aliases: ['bi', 'aboutbot'],
  description: 'Display information about the bot',
  permissions: ['SendMessages'],
  send: false,
  execute(message) {
    const botInfoEmbed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('> Bot Information')
      .setDescription(`This bot is created and maintained by curly.`)

    message.channel.send({ embeds: [botInfoEmbed] });
  },
};
