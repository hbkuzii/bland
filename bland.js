const { Client, GatewayIntentBits, ActivityType, MessageEmbed, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
const mongoose = require('mongoose');
const { token } = require("./config.json");
const commandHandler = require('./Structures/bot.js');
const fs = require("fs");
const axios = require('axios'); // Make sure to install axios using npm install axios
const { openaiApiKey } = require("./config.json");
const path = require("path")
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a)=>{
    return GatewayIntentBits[a]
  }),
});
const activeBans = new Map();
client.activeBans = new Map();
client.commands = new Map();
client.db = require("quick.db");

client.once('ready', () => {
  const guilds1 = client.guilds.cache.size
  global.allguilds = guilds1
  const users = client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0)
  global.allusers = users
  const channels1 = client.channels.cache.size, textChannels = client.channels.cache.filter((channel) => channel.type ===  0).size, voiceChannels = client.channels.cache.filter((channel) => channel.type ===  2).size
  global.blandchannels = channels1
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  console.log(
    `${chalk.gray.bold(`[${timestamp}]`)}${chalk.gray.cyan.bold(` INFO`)}${chalk.magentaBright.bold` [bland]`}` +
    `${chalk.white.bold(` Logged in as ${client.user.tag} with ${client.commands.size} commands`)}`
  );

  client.user.setActivity({
    type: ActivityType.Custom,
    name: "bland",
    state: "🛰️ /bland",
  });
});
commandHandler(client);

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
});

process.on('uncaughtExceptionMonitor', error => {
  console.error('uncaught Exception Monitor:', error);
});

const randompfp = async () => {
  const filePath = path.join(__dirname, 'Structures', 'pfps.txt');
  const pfpUrls = fs.readFileSync(filePath, 'utf8').split('\n').filter(url => url.trim());

  if (pfpUrls.length === 0) {
    console.log('No profile picture URLs found in pfps.txt');
    return;
  }

  const guilds = client.guilds.cache;

  for (const guild of guilds.values()) {
    const chanId = client.db.get(`pfpchannel_${guild.id}`);
    
    if (!chanId) continue;

    try {
      const channel = await guild.channels.fetch(chanId).catch(error => null);
      if (!channel) continue; 

      const randomUrl = pfpUrls[Math.floor(Math.random() * pfpUrls.length)];

      const embed = new EmbedBuilder()
        .setAuthor({ name: 'Follow Our Pinterest', iconURL: 'https://images-ext-1.discordapp.net/external/patbltTGq126PE_DJ-ZVbxORqhW8cipRzo95lYr6FaE/%3Fsize%3D240%26quality%3Dlossless/https/cdn.discordapp.com/emojis/1026647994390552666.webp', url: 'https://www.pinterest.com/antibanners/'})
        .setColor("2B2D31")
        .setImage(randomUrl)
        .setTimestamp();

      channel.send({ embeds: [embed] });
    } catch (e) {
      console.error(`Error sending pfp to guild ${guild.name}`, e);
    }
  }
};

setInterval(() => {
  randompfp();
}, 20 * 1000);

client.on("userUpdate", (oldUser, newUser) => {
  const guilds = client.guilds.cache;

  if (oldUser.username !== newUser.username) {
    guilds.forEach((guild) => {
      const channelId = client.db.get(`discrimchannel_${guild.id}`);
      const channel = guild.channels.cache.get(channelId);

      if (channel) {
        let message;

        if (oldUser.discriminator === "0") {
          message = `**${oldUser.username}** has been **dropped**.`;
        } else {
          message = `**${oldUser.username}#${oldUser.discriminator}** is now **available**.`;
        }

        channel.send(message);
      }
    });
  }
});
client.on('guildMemberAdd', (member) => {
  const isAntibotEnabled = db.get(`antibot_${member.guild.id}`);
  if (isAntibotEnabled && member.user.bot) {
    member.kick("Antibot feature is enabled.");
  }
});
client.login(token);
