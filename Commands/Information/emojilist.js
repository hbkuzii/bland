const { EmbedBuilder, paginatorInstance } = require('discord.js');
const db = require('quick.db');
const config = require('../../config.json');

module.exports = {
  name: "level",
  description: "Check your current level, XP, and progress towards the next level",
  usage: "(user mention, optional)",
  category: 'Users',
  send: false,
  execute(message, args, client) {
    message.channel.sendTyping();

    if (!config.levelingEnabled) {
      ctx.warn("The leveling system is not enabled in this server.");
      return;
    }

    const targetUser = message.mentions.users.first() || message.author;
    const guildId = message.guild.id;

    const userLevel = db.get(`level_${guildId}_${targetUser.id}`) || 1;
    const userXP = db.get(`xp_${guildId}_${targetUser.id}`) || 0;

    const levelUpThreshold = 100 + (userLevel - 1) * 100;

    const remainingXP = levelUpThreshold + userXP - userXP;
    const progress = (userXP / levelUpThreshold) * 100;

    const progressBar = generateProgressBar(progress, 10, "<:levelwhite:1178848590949519430>", "<:levelblue:1178848586662957206>");

    const allUsers = message.guild.members.cache.map(member => {
      const level = db.get(`level_${member.user.id}`) || 1;
      return { id: member.user.id, level };
    });
    const sortedUsers = allUsers.sort((a, b) => b.level - a.level);

    const userRank = sortedUsers.findIndex(u => u.id === targetUser.id) + 1;

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${targetUser.username}`, iconURL: targetUser.displayAvatarURL({ dynamic: true }) })
      .setTitle(`${targetUser.username}'s Level`)
      .setColor(config.color)
      .addFields(
        { name: 'Level', value: `${userLevel}`, inline: true },
        { name: 'Experience', value: `${userXP}/${remainingXP}`, inline: true },
        { name: 'Server Rank', value: `#${userRank}`, inline: true }
      )
      .addFields(
        { name: `Progress (${progress.toFixed(2)}%)`, value: `<:blueend:1178850195237249126>${progressBar}<:whiteend:1178851577830846535>` },
      );

    // Paginator for leaderboard
    const chunkSize = 10; // Change this to adjust the number of users per page
    const chunkedUsers = [];
    for (let i = 0; i < sortedUsers.length; i += chunkSize) {
      chunkedUsers.push(sortedUsers.slice(i, i + chunkSize));
    }

    const leaderboardEmbeds = chunkedUsers.map((chunk, index) => (
      new EmbedBuilder()
        .setTitle(`Level Leaderboard - Page ${index + 1}/${chunkedUsers.length}`)
        .setColor(config.color)
        .setDescription(
          chunk.map((user, userIndex) =>
            `**${userIndex + 1 + index * chunkSize}.** ${message.guild.members.cache.get(user.id).user.tag} - Level ${user.level}`
          ).join('\n')
        )
    ));

    // Add paginator for leaderboard
    new paginatorInstance(
      message, {
        embeds: leaderboardEmbeds,
        text: `Leaderboard ∙ Page {page} of {pages}`,
      }
    ).construct();

    // Send the initial user level embed
    message.channel.send({ embeds: [embed] });
  },
};

function generateProgressBar(progress, totalBars, emptyBarChar, filledBarChar) {
  const filledBars = Math.round((progress / 100) * totalBars);
  const emptyBars = totalBars - filledBars;

  return `${filledBarChar.repeat(filledBars)}${emptyBarChar.repeat(emptyBars)}`;
}
