const { EmbedBuilder } = require("discord.js");
const client = require("../../bland.js");

module.exports = {
  name: "volume",
  description: "Adjust the volume of the music.",
  usage: "(volume)",
  category: 'Music',
  send: false,
  async execute(message, args, client) {
    const { member, guild, channel } = message;

    const embed = new EmbedBuilder();

    const currentQueue = client.distube.getQueue(guild.id);
    
    if (args.length === 0) {
      return ctx.embed(`🔊 Current Volume: ${currentQueue.volume}%`);
    }

    const volume = parseInt(args[0]);

    if (!currentQueue) {
      return ctx.warn("There is no active queue.");
    }
    if (isNaN(volume) || volume < 0 || volume > 100) {
      return ctx.warn('Please provide a valid volume level between 0 and 100.');
    }

    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return ctx.warn('You must be in a voice channel to adjust the volume!');
    }

    try {
      client.distube.setVolume(guild.id, volume);
      ctx.approve(`🔊 Volume set to ${volume}%`);

    } catch (err) {
      console.log(err);
      ctx.error()

    }
  }
};
