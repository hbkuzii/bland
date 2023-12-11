const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

// Map to store user cooldowns
const cooldowns = new Map();

module.exports = {
  name: 'feedback',
  description: 'Provide feedback on the bot',
  usage: '(feedback message)',
  category: 'Miscellaneous',
  parameters: ['`feedback message`'],
  permissions: ['SendMessages'],
  cooldown: 3600, // Cooldown time in seconds (1 hour)

  execute(message, args, client) {
    const feedbackMessage = args.join(' ');

    if (!feedbackMessage) {
      return ctx.warn("Please provide your feedback!");
    }

    const feedbackChannel = client.channels.cache.get('1175436883870875738');

    if (!feedbackChannel) {
      return ctx.warn("Feedback channel not found. Please contact the bot owner.");
    }

    // Check if user is on cooldown
    if (cooldowns.has(message.author.id)) {
      return ctx.warn("You are on cooldown. Please wait before using this command again.");
    }

    // Set cooldown for the user
    cooldowns.set(message.author.id, Date.now() + this.cooldown * 1000);
    setTimeout(() => cooldowns.delete(message.author.id), this.cooldown * 1000);

    const feedbackEmbed = new EmbedBuilder()
      .setTitle('New Feedback')
      .setDescription(`> ${feedbackMessage}`)
      .setColor(config.color)
      .setTimestamp();

    feedbackChannel.send({ embeds: [feedbackEmbed] });

    message.react("✨");
  },
};
