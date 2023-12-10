const { EmbedBuilder } = require('discord.js');
const { musicCard } = require('musicard');
const fs = require('fs');
const config = require('../../config.json');
module.exports = {
  name: 'queue',
  send: false,
  description: 'Show the current queue.',
  async execute(message, args) {
    const { client } = message;

    const queue = client.distube.getQueue(message.guild.id);
    if (!queue) {
      return message.channel.send('There is no music playing right now!');
    }

    const songs = queue.songs.map((song, index) => `${index + 1}. ${song.name} - \`${song.formattedDuration}\``);

    const chunkSize = 10;
    const chunkedSongs = [];
    for (let i = 0; i < songs.length; i += chunkSize) {
      chunkedSongs.push(songs.slice(i, i + chunkSize));
    }

    const pages = chunkedSongs.map((chunk, index) => {
      const embed = new EmbedBuilder()
      .setAuthor({
        name : 'bland',
        iconURL : client.user.displayAvatarURL()
    })
        .setColor(config.color)
        .setTitle('Music Queue - Page ' + (index + 1))
        .setDescription(chunk.join('\n'))
        .addFields({ name: 'Now Playing', value: `${queue.songs[0].name} - \`${queue.songs[0].formattedDuration}\`` });
      return embed;
    });

    await new paginatorInstance(message, {
      embeds: pages,
      iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Circle-icons-music.svg/1024px-Circle-icons-music.svg.png', // Replace with your icon URL
      text: `Music Queue ∙ Page {page} of {pages}`,
    }).construct();
  },
};
