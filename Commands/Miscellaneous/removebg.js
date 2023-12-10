const { MessageAttachment, MessageEmbed, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../config.json');

module.exports = {
  name: 'removebackground',
  description: 'Remove the background from an image',
  usage: '<image>',
  permissions: ['SendMessages', 'AttachFiles'],
  category: 'Image Manipulation',
  async execute(message, client, args) {
    const image = message.attachments.first();

    if (!image) {
      return message.reply('Please attach an image for background removal.');
    }

    try {
        const response = await axios.post(
            'https://api.remove.bg/v1.0/removebg',
            {
              image_url: image.proxyURL,
              size: 'auto',
            },
            {
              headers: {
                'X-Api-Key': 'cJr3fzankNhtBUqoUjRxRszT', // Replace with your Remove.bg API key
                'Content-Type': 'application/json',
              },
              responseType: 'arraybuffer',
            }
          );
          

      const arrayBuffer = await response.data;
      const buffer = Buffer.from(arrayBuffer);
      const attachment = new AttachmentBuilder(buffer, 'removebg.png');

      const embed = new MessageEmbed()
        .setColor(config.color)
        .setTitle('Removed background from your image')
        .setImage('attachment://removebg.png');

      message.reply({ embeds: [embed], files: [attachment] });
    } catch (error) {
      console.error('Error removing background:', error.response.data);
      message.reply('An error occurred while removing the background.');
    }
  },
};
