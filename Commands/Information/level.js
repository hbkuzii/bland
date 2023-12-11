const { charToHex } = require('discord-emojis-parser');
const db = require('quick.db');
const { EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: "level",
  description: "Check your current level, XP, and progress towards the next level",
  usage: "(user mention, optional)",
  category: 'Users',
  send: false,
  execute(message, args, client) {
    message.channel.sendTyping();

    const isLevelingEnabled = db.get(`leveling_${message.guild.id}`);
    if (!isLevelingEnabled){ ctx.warn("The leveling system is not enabled in this server."); return;

    }

    const subCommand = args[0];
    if (subCommand === 'leaderboard') {
      return  displayLeaderboard(message);
    }

    const targetUser = message.mentions.users.first() || message.author;
    const guildId = message.guild.id;

    const userLevel = db.get(`level_${message.guild.id}_${targetUser.id}`) || 1;
    const userXP = db.get(`xp_${message.guild.id}_${targetUser.id}`) || 0;

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
    message.channel.send({ embeds: [embed] });
  },
};

function generateProgressBar(progress, totalBars, emptyBarChar, filledBarChar) {
  const filledBars = Math.round((progress / 100) * totalBars);
  const emptyBars = totalBars - filledBars;

  return `${filledBarChar.repeat(filledBars)}${emptyBarChar.repeat(emptyBars)}`;
}
async function displayLeaderboard(message) {
  try {
    const allUsers = message.guild.members.cache.map(member => {
      const userLevel = db.get(`level_${message.guild.id}_${member.user.id}`) || 1;
      const userXP = db.get(`xp_${message.guild.id}_${member.user.id}`) || 0;
      return { id: member.user.id, level: userLevel, xp: userXP };
    });

    const sortedUsers = allUsers.sort((a, b) => a.xp - b.xp).reverse(); // Sort by XP in descending order


    const chunkSize = 10;
    const leaderboardList = sortedUsers.map((user, index) => `${index + 1}. ${message.guild.members.cache.get(user.id).user.username} - Level ${user.level} | XP: ${user.xp}`);

    const chunkedLeaderboardList = [];
    for (let i = 0; i < leaderboardList.length; i += chunkSize) {
      chunkedLeaderboardList.push(leaderboardList.slice(i, i + chunkSize));
    }

    const embeds = chunkedLeaderboardList.map((chunk, index) => (
      new EmbedBuilder({
        author: {
          name: message.guild.name,
          iconURL: message.guild.iconURL({ dynamic: true }),
        },
        title: `Experience Leaderboard - Page ${index + 1}/${chunkedLeaderboardList.length}`,
        description: chunk.join('\n'),
        footer: { text: 'Leaderboard' }, // 'context' was replaced with 'text'
      }).setColor(config.color)
    ));

    await new paginatorInstance(
      message, {
        embeds,
        text: `Leaderboard ∙ Page {page} of {pages}`, // 'context' was replaced with 'text'
      }
    ).construct();
  } catch (error) {
    console.error(error);
    //ctx.error()
  }
}