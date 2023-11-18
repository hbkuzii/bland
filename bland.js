const { Client, GatewayIntentBits, ActivityType, MessageEmbed, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
const mongoose = require('mongoose');
const { token } = require("./config.json");
const commandHandler = require('./Structures/bot.js');
const fs = require("fs");
const path = require("path");

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
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
    // Loop through activeBans map and set up timers for any ongoing temporary bans
    activeBans.forEach(async (banData, key) => {
      const currentTime = Date.now();
      const timeLeft = banData.duration - (currentTime - banData.startTime);
  
      if (timeLeft > 0) {
        activeBans.set(key, {
          ...banData,
          timeout: setTimeout(async () => {
            const timeoutData = activeBans.get(key);
            
            // Your existing unban logic here
            const guildId = key.split('.')[0];
            const guild = client.guilds.cache.get(guildId);
            if (guild) {
              const targetUser = await guild.members.fetch(key.split('.')[1]);
              if (targetUser) {
                await guild.members.unban(targetUser.id, 'Temporary ban expired');
                const formattedDuration = formatDuration(timeoutData.duration);
                guild.channels.cache
                  .find((channel) => channel.type === 'text')
                  .send(`**${targetUser.user.tag}** has been unbanned after the temporary ban${formattedDuration}.`);
              }
            }
  
            // Remove the ban data from the map
            activeBans.delete(key);
          }, timeLeft),
        });
      } else {
        // The ban has already expired, perform cleanup if needed
        activeBans.delete(key);
      }
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
client.login(token);
