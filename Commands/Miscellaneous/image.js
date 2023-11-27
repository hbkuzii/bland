const { EmbedBuilder } = require('discord.js');
const gis = require('g-i-s');
const config = require('../../config.json');

module.exports = {
    name: 'image',
    aliases: ['im', 'img'],
    description: 'Search Google for an image',
    permissions: ['SendMessages'],
    usage: '(search)',
    example: 'jordan 4s',
    parameters: ['`search`'],
    category: 'Miscellaneous',
    execute(message, args) {
        const filter = (reaction, user) => user.id === message.author.id && (reaction.emoji.name === '⬅️' || reaction.emoji.name === '➡️');
        let page = 0;
        let search = args.join(' ');

        message.channel.sendTyping()
        async function updateImg() {
            const searchOptions = {
                searchTerm: search,
                queryStringAddition: '&safe=active',
            };

            gis(searchOptions, logResults);

            function logResults(error, results) {
                if (error) {
                    console.log(error);
                } else {
                    if (results.length === 0) {
                        message.channel.send(`No images found for ${search}`);
                    } else {
                        const embeds = results.map((result, index) => (
                            new EmbedBuilder({
                                color: config.default,
                                title: `**${search}**`,
                                url: result.url,
                                color: config.color,
                                image: { url: result.url },
                                footer: {
                                    text: `${index + 1}/${results.length} of Google Image Search Results`,
                                    iconURL: 'https://th.bing.com/th/id/R.68fc8758cbb72878f025459d1ab12465?rik=p%2fzYsNa11f%2bKvQ&pid=ImgRaw&r=0',
                                },
                            })
                        ));

                        new paginatorInstance(
                            message, {
                                embeds,
                                text: `Page {page} of {pages}`,
                            }
                        ).construct();
                    }
                }
            }
        }

        updateImg();
    },
};
