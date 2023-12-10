const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../config.json')

module.exports = {
  name: "shazam",
  aliases: ["recognize"],
  description: 'Recognize a song using Shazam',
  usage: '(url or attach an audio file)',
  parameters: ['`attachement`'],
  category: 'Miscellaneous',
  permissions: ['SendMessages'],
  async execute(message, args, client) {
    const url = args[0];
    const attachedFile = message.attachments.first();

    message.channel.sendTyping();
    let audioUrl = url;

    if (attachedFile) {
      audioUrl = attachedFile.url;
    }

    const options = {
      method: 'POST',
      url: 'https://shazam-api6.p.rapidapi.com/shazam/recognize/',
      params: { url: audioUrl },
      headers: {
        'X-RapidAPI-Key': '198a920c30mshe1ca9f302b1bf80p1806d5jsncaf427e12291',
        'X-RapidAPI-Host': 'shazam-api6.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const songData = response.data;
      const track = songData.result.track;
      const artist = track.subtitle;
      const link = track.share.href;
      const title = track.title;
      const coverArt = track.images.coverart;
      const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(`> ${title} - ${artist}`)
        .setURL(link)
        .setImage(coverArt);

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      ctx.error();
    }
  }
};
