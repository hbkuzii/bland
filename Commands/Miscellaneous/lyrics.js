const { MessageActionRow, MessageButton } = require('discord.js');
const Genius = require("genius-lyrics");
const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const { charToHex } = require('discord-emojis-parser');

module.exports ={
    name: 'lyrics',
    description: 'Search for lyrics of a song',
    usage: '<song>',
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
        message.channel.sendTyping()
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


            await new paginatorInstance(
                message, {
                    embeds : embeds,
                    iconURL : 'https://images.genius.com/2aa2941e1d8ed0034c2ddc9dd5012af9.1000x1000x1.png',
                    text: `Genius ∙ Page {page} of {pages}`
                }
            ).construct()
        } 
    }