const { EmbedBuilder } = require("discord.js");
const client = require("../../bland.js");

module.exports = {
  name: "play",
  description: "Play a song.",
  usage: "(query)",
  async execute(message, args, client) {
    const { member, guild, channel } = message;
    const query = args.join(" ");
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return channel.send('You must be in a voice channel to execute \`play\`!');
    }
    try {
      client.distube.play(voiceChannel, query, { textChannel: channel, member: member });

      channel.sendTyping()
    } catch (err) {
      console.error(err);
    }
  }
};