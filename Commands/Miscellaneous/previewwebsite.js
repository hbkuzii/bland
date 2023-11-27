const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const { ContextMenuCommandAssertions } = require('discord.js');


module.exports = {
  name: 'previewwebsite',
  description: 'Preview a website by uploading its HTML file',
  usage: '(html-file)',
  permissions: ['SendMessages'],
  category: "Miscellaneous",
  execute(message, args, client) {
    const attachment = message.attachments.first();

    if (!attachment.name.endsWith('.html')) {
     ctx.warn('Please upload a valid HTML file for preview.');
      return;
    }
    message.channel.sendTyping();
    const channel = message.guild.channels.cache.get('1175436883870875738');
    const msg = channel.send({ files: [attachment] });
    const proxy = msg.attachments.first().url;
    const url = `https://mahto.id/chat-exporter?url=${proxy}`;

    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Open')
          .setStyle(ButtonStyle.Link)
          .setURL(url)
      );

      const embed = new EmbedBuilder()
      .setDescription(`> Your [**preview**](${url}) is ready!`)
      .setColor(config.color)
    message.reply({
      embeds: [embed],
      components: [button],
      ephemeral: true,
    });
    
  },
};
