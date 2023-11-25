const weather = require('weather-js');
const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'weather',
    description: 'Get the current weather for a location',
    category: 'Miscellaneous',
    async execute(message, args) {
        try {
            if (!args.length) {
                return message.channel.send('Please provide a location for the weather.');
            }

            const location = args.join(' ');

            weather.find({ search: location, degreeType: 'C' }, function (err, result) {
                if (err) {
                    console.error(err);
                    return message.channel.send('An error occurred while fetching the weather information.');
                }

                if (!result || result.length === 0) {
                    return message.channel.send('No weather information found for the provided location.');
                }

                const current = result[0].current;
console.log(current)
                const embed = new EmbedBuilder({
                    author : {
                        name : message.member.displayName,
                        iconURL : message.member.displayAvatarURL({
                            dynamic : true
                        })
                    },
                    title: `${current.skytext}, ${current.observationpoint}`,
                    fields: [
                        {
                            name: 'Temperature',
                            value: `${current.temperature}°C`,
                            inline: true,
                        },
                        {
                            name: 'Feels Like',
                            value: `${current.feelslike}°C`,
                            inline: true,
                        },
                        {
                            name: 'Humidity',
                            value: `${current.humidity}%`,
                            inline: true,
                        }
                    ],
                    thumbnail: {
                        url: current.imageUrl,
                    },
                })	.setFooter({ text: `wind: ${current.windspeed}`}).setTimestamp().setColor(config.color);
                message.reply({ embeds: [embed] });
            });
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while fetching the weather information.');
        }
    },
};
