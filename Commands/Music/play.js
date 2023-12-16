const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "play",
  aliases: ['p'],
  category: 'Music',
  description: "Play a song.",
  usage: "(query)",
  async execute(message, args, client) {
    const { member, guild, channel } = message;
    const query = args.join(" ");
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return channel.send('You must be in a voice channel to execute \`play\`!');
    }

    if (client.distube.getQueue(guild.id) && voiceChannel.id !== client.distube.getQueue(guild.id).voiceChannel.id) {
      return channel.send(`I'm already in <#${client.distube.getQueue(guild.id).voiceChannel.id}>!`);
    }

    try {
      client.distube.play(voiceChannel, query, { textChannel: channel, member: member });

      channel.sendTyping()

    } catch (err) {
      console.error(err);
    }
  }
};