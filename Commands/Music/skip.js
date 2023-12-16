const { EmbedBuilder } = require("discord.js");
const client = require("../../bland.js");

module.exports = {
    name: "skip",
    send: false,
    description: "Skip one or more songs in the queue.",
    category: 'Music',
    permissions: ['SendMessages'],
    async execute(message, args, client) {
        const { member, guild, channel } = message;  
      const queue = client.distube.getQueue(message.guildId);

      if (!member.voice.channel) {
        return ctx.warn("You must be in a voice channel to execute \`resume\`!");
      }
        if (member.voice.channel.id !== queue.voiceChannel.id) {
        ctx.warn("You must be in the same voice channel as the bot to resume the music!");
        return;
      }
      if (!queue) {
        return ctx.warn("There is no active queue.");
      }
  
      const songsToSkip = parseInt(args[0]) || 1;
  
      if (queue.songs.length <= 1) {
        return ctx.warn("Not enough songs in the queue to skip.")
      }
  
      for (let i = 0; i < songsToSkip; i++) {
        client.distube.skip(message.guild);
      }
  
     ctx.approve(`skipped ${songsToSkip} song(s).`)
    }
  };