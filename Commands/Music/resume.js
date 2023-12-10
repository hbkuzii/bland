const { EmbedBuilder } = require("discord.js");
const client = require("../../bland.js");

module.exports = {
  name: "resume",
  description: "Resume the paused song.",
  send: false,
  async execute(message) {
    const { member, guild, channel } = message;
    const embed = new EmbedBuilder();

    if (!member.voice.channel) {
      return ctx.warn("You must be in a voice channel to execute \`resume\`!");
    }

    try {
      const queue = client.distube.getQueue(guild);

      if (!queue || !queue.pause) {
        ctx.warn("Music is not paused.");
        return;
      }

      if (member.voice.channel.id !== queue.voiceChannel.id) {
        ctx.warn("You must be in the same voice channel as the bot to resume the music!");
        return;
      }

      client.distube.resume(guild);

      message.react("✅");

    } catch (err) {
      console.log(err);
      ctx.error();
    }
  },
};
