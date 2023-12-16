const { EmbedBuilder } = require("discord.js");
const client = require("../../bland.js");

module.exports = {
  name: "shuffle",
  description: "Shuffle the songs in the queue.",
  category: 'Music',
  permissions: ['SendMessages'],
  send: false,
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
      if (!queue) {
        return ctx.warn("There is no active queue.");
      }
    if (!queue.songs.length || queue.songs.length === 1) {
      return ctx.warn("Not enough songs in the queue to shuffle.");
    } else {
      client.distube.shuffle(guild.id);
      ctx.embed("🔀 Queue shuffled.");
    }
  }
};