const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const { ContextMenuCommandAssertions } = require('discord.js');
const Genius = require("genius-lyrics");
module.exports = {
    name: 'lyrics',
    description: 'Search for lyrics of a song',
    usage: '(song-name)',
    permissions: ['SendMessages'],
    category: "Miscellaneous",
    async execute(message, args) {
        const songName = args.join(' ');
        const Client = new Genius.Client(process.env.GENIUS_ACCESS);
        const searches = await Client.songs.search(songName);

        if (!searches[0]) {
            ctx.warn('No lyrics found for that song.');
            return;
        }
        message.channel.sendTyping();
        const song = searches[0];
        const lyrics = await song.lyrics();

        const embeds = await Promise.all(lyrics.match(/[\s\S]{1,2048}/g).map((x) => {
            return new EmbedBuilder()
                .setAuthor({
                    name: message.member.displayName,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setTitle(`${song.artist.name} - ${song.title}`)
                .setURL(song.url)
                .setDescription(x)
                .setThumbnail(song.image)
                .setColor(config.color);
        }));

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Genius')
                    .setStyle(ButtonStyle.Link)
                    .setURL(song.url)
            );

        message.reply({
            embeds: embeds,
            components: [row],
        });
        message.channel.stopTyping();
    }
};