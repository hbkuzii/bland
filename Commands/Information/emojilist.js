const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const { charToHex } = require('discord-emojis-parser');

module.exports = {
    name: 'emojilist',
    description: 'List all emojis in the server',
    category: 'Information',
    permissions: ['SendMessages'],
    send: false,
    async execute(message, args, client) {
        try {
            const emojis = message.guild.emojis.cache;

            if (!emojis.size) {
                return ctx.warn('No emojis found in this server.');
            }

            const chunkSize = 10;
            const emojiList = emojis.map((emoji) => `${emoji} - \`${emoji.name}\``);

            const chunkedEmojiList = [];
            for (let i = 0; i < emojiList.length; i += chunkSize) {
                chunkedEmojiList.push(emojiList.slice(i, i + chunkSize));
            }

            const embeds = chunkedEmojiList.map((chunk, index) => (
                new EmbedBuilder({
                    author: {
                        name: message.guild.name,
                        iconURL: message.guild.iconURL({ dynamic: true }),
                    },
                    title: `Emoji List - Page ${index + 1}/${chunkedEmojiList.length}`,
                    description: chunk.join('\n'),
                    footer: { context: 'Emojis' },
                }).setColor(config.color)
            ));
            
            await new paginatorInstance(
                message, {
                    embeds,
                    text: `{context} ∙ Page {page} of {pages}`,
                }
            ).construct();
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while fetching the emoji list.');
        }
    },
};
