const Discord = require('discord.js');
const moment = require('moment');
const ms = require('ms');
const config = require("../../config.json");


module.exports = {
  name: "serverinfo",
  aliases: ["si", "guildinfo", "ginfo", "gi"],
  category: "information",
  description: 'View information about a server',
  send: false,
  permissions: ['SendMessages'],
  async execute(message) {

    const botCount = message.guild.members.cache.filter(m => m.user.bot).size;
    const humanCount = message.guild.memberCount - botCount
    const { guild } = message
    const emojicount = message.guild.emojis.cache
    const roles = message.guild.roles.cache
    const create = `${moment(message.guild.createdAt).format("MMM Do YYYY")} (${ms(Date.now() - message.guild.createdAt, { long: true })})`

    let banner = message.guild.bannerURL({ dynamic: true, format: "png", size: 2048 })
    if (banner) {
      banner = `[here](${banner})`;
    } else {
      banner = 'N/A';
    }

    let splash = message.guild.splashURL({ dynamic: true, format: "png", size: 2048 })
    if (splash) {
      splash = `[here](${splash})`;
    } else {
      splash = 'N/A';
    }

    let icon = message.guild.iconURL({ dynamic: true, format: "png", size: 2048 })
    if (icon) {
      icon = `[here](${icon})`;
    } else {
      icon = 'N/A';
    }

    let vanity = message.guild.vanityURLCode
    if (vanity) {
      vanity = `(discord.gg/${message.guild.vanityURLCode})`
    } else {
      vanity = ''
    }

    let features = [];

    guild.features.forEach(feature => {
      features.push(
        feature
          .toLowerCase()
          .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
          .replace(/_/g, " ")
          .replace(/Guild/g, "Server")
          .replace(/Use Vad/g, "Use Voice Acitvity")
      );
    });

    const verificationLevels = {
      NONE: 'None',
      LOW: 'Low',
      MEDIUM: 'Medium',
      HIGH: 'High',
      VERY_HIGH: 'Highest'
    };

    const createTimestamp = `<t:${Math.floor(message.guild.createdTimestamp / 1000)}:D> (<t:${Math.floor(message.guild.createdTimestamp / 1000)}:R>)`;
    const embed = new Discord.EmbedBuilder()
      .setColor(config.color)
      .setAuthor({ name: `wow`, iconURL: message.author.displayAvatarURL({
        dynamic: true
      })})
      .setTitle(`${guild.name} ${vanity} ${message.guild.verified ? `☑️` : ``}`)
      .setDescription(`Server created on ${createTimestamp}`)
      .setThumbnail(message.guild.iconURL({
        dynamic: true,
        format: "png",
        size: 2048
      }))
      .setImage(message.guild.bannerURL({
        dynamic: true,
        format: "png",
        size: 2048
      }))
    embed.setFooter({ text: `Guild ID: ${guild.id}`})
      .setTimestamp()
      .addFields(
        {
          name: "**Members**",
          value: `> **Total:** ${guild.memberCount}\n> **Humans:** ${humanCount}\n> **Bots:** ${botCount}`,
          inline: true,
        },
        {
          name: "**Information**",
          value: `**Region:** ${guild.region}\n**Verification:** ${verificationLevels[guild.verificationLevel]}\n**Level:** ${guild.premiumTier}\n**Boosts:** ${guild.premiumSubscriptionCount}`,
          inline: true,
        },
        {
          name: "**Other**",
          value: `> **Roles:** ${roles.size}/250\n> **Emojis:** ${emojicount.size}/250\n> **Owner**: ${message.guild.owner}`,
          inline: true,
        },
        {
          name: "Features",
          value: features.length ?
            "```bf\n" + features.map(feature => `${feature}`).join(", ") + "```" :
            "N/A",
          inline: true
        })
    message.channel.send({ embeds: [embed]} )
  }
}
