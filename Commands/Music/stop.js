const { EmbedBuilder } = require("discord.js");


module.exports = {
    name: "leave",
    send: false,
    aliases: ['stop', "disconnect"],
    description: "Stop playing music.",
    category: 'Music',
    async execute(message, args, client) {
      const { guild, channel, member } = message;
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
  
      client.distube.stop(guild);
  
      message.react("👋");
    }
  };