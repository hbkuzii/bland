const { EmbedBuilder } = require("discord.js");
const { DisTubeError } = require("distube"); // Import the DisTubeError

module.exports = {
    name: "pause",
    send: false, 
    category: 'Music',
    description: "Pause the currently playing song.",
    async execute(message, client) {
        const { member, guild, channel } = message;
        const embed = new EmbedBuilder();
        const queue = client.distube.getQueue(guild);

        if (!member.voice.channel) {
            return ctx.warn("You must be in a voice channel to execute \`pause\`!");
        }
        if (member.voice.channel.id !== queue.voiceChannel.id) {
            ctx.warn("You must be in the same voice channel as the bot to resume the music!");
            return;
          }

        try {
            client.distube.pause(guild);
            message.react('🕯️');

        } catch (err) {
            console.log(err);

            // Handle DisTubeError with errorCode 'PAUSED'
            if (err instanceof DisTubeError && err.code === 'PAUSED') {
                return ctx.warn("The queue has been paused already!");
            }
        }
    },
};
