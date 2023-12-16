const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'serverlist',
    description: 'List all servers the bot is in',
    category: 'Developer',
    permissions: ['SendMessages'],
    send: false,
    async execute(message, args, client) {
      
      const ownerId = '1068177499231621270';
      if (message.author.id !== ownerId) {
          return message.channel.send('You do not have permission to use this command.');
      }

        try {
            const guilds = client.guilds.cache;

            if (!guilds.size) {
                return ctx.warn('The bot is not in any servers.');
            }

            const chunkSize = 10;
            const guildList = guilds.map((guild) => `${guild.name} - \`${guild.id}\``);

            const chunkedGuildList = [];
            for (let i = 0; i < guildList.length; i += chunkSize) {
                chunkedGuildList.push(guildList.slice(i, i + chunkSize));
            }

            const embeds = chunkedGuildList.map((chunk, index) => (
                new EmbedBuilder({
                    title: `Server List - Page ${index + 1}/${chunkedGuildList.length}`,
                    description: chunk.join('\n'),
                    footer: { context: 'Servers' },
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
            message.channel.send('An error occurred while fetching the server list.');
        }
    },
};
