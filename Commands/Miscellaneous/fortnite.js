const client = require('../../bland.js');
const { fetch } = require('undici');
const commands = ['lookup', 'search', 'find', 'shop'];
const config = require('../../config.json');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'fortnite',
  description : 'Lookup or view the current fortnite item shop',
  usage : '(subcommand) <args>',
  example : 'lookup Wildcat',
  aliases : [ 'fort', 'fn' ],
  subcommands: '\`fortnite lookup\` - Search for a fortnite cosmetic\n\`fortnite shop\` - Display the current item shop',
  category: "Miscellaneous",
  async execute(message, args) {
    const command = String(args[0]).toLowerCase();

    if (!args[0] || !commands.includes(command)) {
        return;
    }

    switch (true) {
        case command === 'lookup' || command === 'search' || command === 'find': {
            try {
                if (!args[1]) {
                    return this.bot.help(message, this.commands[0]);
                }
                message.channel.sendTyping();
                const results = await fetch(
                    `https://fortnite-api.com/v2/cosmetics/br/search?matchMethod=contains&name=${encodeURIComponent(
                        args.slice(1).join(' ')
                    )}`,
                    {
                        method: 'GET',
                    }
                ).then((response) => response.json()).catch((error) => {
                    return this.bot.warn(
                        message,
                        `Bad response (\`${error.response.status}\`) from the **API**`
                    );
                });

                if (results.status !== 200) {
                    return this.bot.warn(
                        message,
                        `Cosmetic **${args.slice(1).join(' ')}** not found`
                    );
                }

                const { name, description, type, introduction, added, shopHistory } = results.data;

                const occurrences = [];

                if (shopHistory) {
                    const dates = shopHistory
                        .sort((a, b) => new Date(b) - new Date(a))
                        .slice(0, 5)
                        .map((date) => new Date(date).getTime());

                    await Promise.all(
                        dates.map((date) => {
                            date = Math.floor(date / 1000);

                            occurrences.push(`> <t:${date}:D> (<t:${date}:R>)`);
                        })
                    );
                }

                const results2 = await fetch(
                    `https://fnbr.co/api/images?search=${encodeURI(
                        name
                    )}&limit=${encodeURI(1)}&type=${encodeURI(type.value)}`,
                    {
                        method: 'GET',
                        headers: {
                            'x-api-key': 'b0304093-8d19-43e4-a7e1-2815c40c8bd0',
                        },
                    }
                ).then((response) => response.json());

                console.log(results2.data);

                const { images, readableType } = results2.data[0];

                const date = new Date(added);

                const dateToCompare = new Date('2019-11-20');

                const malformedDate =
                    date.getFullYear() === dateToCompare.getFullYear() &&
                    date.getMonth() === dateToCompare.getMonth() &&
                    date.getDate() === dateToCompare.getDate();

                message.reply({
                    embeds: [
                        new EmbedBuilder({
                            author: {
                                name: message.member.displayName,
                                iconURL: message.member.displayAvatarURL({
                                    dynamic: true,
                                }),
                            },
                            title: `${name}`,
                            url: `https://fnbr.co/${type.value}/${name.replaceAll(' ', '-')}`,
                            description: `${description}${
                                introduction ? (introduction.text ? `\n> ${introduction.text}` : '') : ''
                            }`,
                            fields: occurrences.length
                                ? [
                                      {
                                          name: `Occurrence${occurrences.length > 1 ? 's' : ''}`,
                                          value: `${occurrences.join('\n')}`,
                                      },
                                  ]
                                : [],
                            footer: {
                                text: `${readableType}${!malformedDate ? ` | Added on` : ''}`,
                            },
                            thumbnail: {
                                url: images.icon,
                            },
                            timestamp: malformedDate ? null : date,
                        }).setColor(config.color),
                    ],
                });
            } catch (error) {
                return ctx.error()
            }

            break;
        }

        case command === 'shop' || command === 'store': {
            try {
                const date = new Date(),
                    day = date.getDate(),
                    month = date.getMonth() + 1,
                    year = date.getFullYear(),
                    format = `${day}-${month}-${year}`;

                message.channel.send({
                    embeds: [
                        new EmbedBuilder({
                            author: {
                                name: message.member.displayName,
                                iconURL: message.member.displayAvatarURL({
                                    dynamic: true,
                                }),
                            },
                            title: '> Fortnite Item Shop',
                            url: `https://fortnite.gg/shop`,
                            image: {
                                url: `https://bot.fnbr.co/shop-image/fnbr-shop-${format}.png`,
                            },
                        }).setColor(config.color),
                    ],
                });
            } catch (error) {
                return ctx.error()
            }

            break;
        }
    }
}
};