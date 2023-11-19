const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const { ContextMenuCommandAssertions } = require('discord.js');
const Genius = require("genius-lyrics");

module.exports = {
    name: 'lyrics',
    description: 'Search for lyrics of a song',
    usage: '(song-name)',
    permissions: ['SendMessages'],
    execute(message, args) {
        if (!args[0]) {
            // Handle case where no song name is provided
            message.channel.send('Please provide the name of the song.');
            return;
        }

        const songName = args.join(' ');

        const Client = new Genius.Client(process.env.GENIUS_ACCESS);
        const searches = Client.songs.search(songName);

        if (!searches || searches.length === 0) {
            // Handle case where no results are found
            message.channel.send('No lyrics found for the given song.');
            return;
        }

        const song = searches[0];
        const lyrics = song.lyrics();

        // Process and send lyrics, similar to your existing code
        // ...

        // Example: Send the first 800 characters of lyrics
        message.channel.send(lyrics.substring(0, 800));
    },
};
