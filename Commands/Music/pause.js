const { DisTubeError } = require("distube"); // Import the DisTubeError

module.exports = {
    name: "pause",
    send: false, 
    category: 'Music',
    description: "Pause the currently playing song.",
    permissions: ['SendMessages'],
    async execute(message, args, client) {
        const { member, guild } = message;
        const queue = client.distube.getQueue(message);

        if (!queue) return ctx.warn(`There is nothing in the queue right now!`);

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
            if (err instanceof DisTubeError && err.code === 'PAUSED') {
                return ctx.warn("The queue has been paused already!");
            }
        }
    },
};
