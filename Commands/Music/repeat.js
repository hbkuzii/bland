const { EmbedBuilder } = require("discord.js");
const client = require("../../bland.js");


module.exports = {
    name: "repeat",
    description: "Toggle repeat mode for the queue.",
    category: 'Music',
    send: false,
    permissions: ['SendMessages'],
    async execute(message, args, client) {
      const { guild, channel, member } = message;
      const embed = new EmbedBuilder();
  
      const queue = client.distube.getQueue(guild.id);
      if (!member.voice.channel) {
        return ctx.warn("You must be in a voice channel to execute \`pause\`!");
    }
    if (member.voice.channel.id !== queue.voiceChannel.id) {
        ctx.warn("You must be in the same voice channel as the bot to resume the music!");
        return;
      }

      if (!queue.songs.length) {
        return ctx.warn("No songs in the queue to repeat.");
      } else {
        const repeatMode = queue.repeatMode;
        client.distube.setRepeatMode(guild.id, repeatMode === 0 ? 1 : 0);
        (`🔁 Repeat mode set to ${repeatMode === 0 ? "queue" : "off"}`);
      }
    }
  };