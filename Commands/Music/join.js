const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "join",
    description: "Join the user's voice channel.",
    category: 'Music',
    send: false,
    permissions: ['SendMessages'],
    async execute(message, args, client) {
        const { guild, member } = message;

        if (!member.voice.channel) {
            return ctx.warn("You must be in a voice channel to execute \`join\`!");
        }

        const voiceChannel = member.voice.channel;

        if (client.distube.getQueue(guild.id)) {
            return ctx.warn("I'm already in a voice channel!");
        }

        const connection = await voiceChannel.join();

        ctx.embed(`🎵 Joined ${voiceChannel.name}!`);

    },
};
