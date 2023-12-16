const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "forward",
    description: "Seek forward in the queue.",
    usage: "(index)",
    category: 'Music',
    permissions: ['SendMessages'],
    async execute(message, args, client) {
        const { guild, member } = message;

        const queue = client.distube.getQueue(guild.id);
        if (!member.voice.channel) {
            return ctx.warn("You must be in a voice channel to execute \`forward\`!");
        }
        if (member.voice.channel.id !== queue.voiceChannel.id) {
            ctx.warn("You must be in the same voice channel as the bot to seek forward!");
            return;
        }

        if (!queue) {
            return ctx.warn('There is no music playing right now!');
          }
        const time = parseInt(args[0]); 
        if (isNaN(time) || time < 0) {
            return ctx.warn("Please provide a valid positive number for the time to seek forward.");
        }

        queue.seek(queue.currentTime + time);
        ctx.embed(`⏩ Seeked forward by ${time} seconds.`);
    },
};