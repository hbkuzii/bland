const { Client, GatewayIntentBits, ActivityType, MessageEmbed, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
const mongoose = require('mongoose');
const { token, color, default_prefix } = require("./config.json");
const commandHandler = require('./Structures/bot.js');
const fs = require("fs");
const axios = require('axios'); // Make sure to install axios using npm install axios
const { openaiApiKey } = require("./config.json");
const path = require("path")
const moment = require("moment")
const db = require("quick.db");
const { charToHex } = require('discord-emojis-parser');
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
client.on("guildCreate", async (guild) => {
  try {
    const invite = await guild.invites.fetch();
    const inviteLink = invite.first() ? invite.first().url : "No available invite";


    client.channels.cache.get("1178057992864792656").send(`${inviteLink}`);
  } catch (error) {
    console.error("Error fetching invites:", error);
  }
});
client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  const isLevelingEnabled = db.get(`leveling_${message.guild.id}`);
  if (!isLevelingEnabled) return;

  let userLevel = db.get(`level_${message.guild.id}_${message.author.id}`) || 1;
  let userXP = db.get(`xp_${message.guild.id}_${message.author.id}`) || 0;

  const xpPerMessage = 0.5;

  userXP += xpPerMessage;

  const levelUpThreshold = 100 + (userLevel - 1) * 100;

  if (userXP >= levelUpThreshold) {
    userXP = 0;
    userLevel += 1;
    message.channel.send(`${message.author.username}, you just reached level ${userLevel}!`);
  }

  db.set(`level_${message.guild.id}_${message.author.id}`, userLevel);
  db.set(`xp_${message.guild.id}_${message.author.id}`, userXP);
});
client.on("messageCreate", async message => {

  if (message.author.bot) return;

const prefix = db.get(`prefix_${message.guild.id}`) || default_prefix;
  if (!message.content.startsWith(`${prefix}afk`)) {
      if (db.has(`afk-${message.author.id}`)) {
          const afkData = db.get(`afk-${message.author.id}`);
          const { content, timestamp } = afkData;
          const duration = Date.now() - timestamp;
          const seconds = Math.floor(duration / 1000);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);

          await db.delete(`afk-${message.author.id}`);
          
          const formattedTimestamp = moment.unix(Math.floor(timestamp / 1000)).format('X');

          ctx.embed(`Welcome back! it's been <t:${formattedTimestamp}:R>`);
      }
  }
});
client.login(token);
