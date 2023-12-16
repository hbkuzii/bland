const { Client, GatewayIntentBits, ActivityType, MessageEmbed, EmbedBuilder, AuditLogEvent, Events, Guild, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const chalk = require('chalk');
const mongoose = require('mongoose');
const { token, color, default_prefix } = require("./config.json");
const config = require("./config.json");
const eventHandler = require('./Structures/event.js');
const commandHandler = require('./Structures/bot.js');
const fs = require("fs");
const axios = require('axios'); // Make sure to install axios using npm install axios
const { openaiApiKey } = require("./config.json");
const path = require("path")
const moment = require("moment")
const db = require("quick.db");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const Erela = require('erela.js')
const { charToHex } = require('discord-emojis-parser');
const Spotify = require('erela.js-spotify');
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a)=>{
    return GatewayIntentBits[a]
  }),
});
const activeBans = new Map();
client.activeBans = new Map();
client.commands = new Map();
client.db = require("quick.db");

commandHandler(client);
eventHandler(client);
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

  const prefix = db.get(`prefix_${message.guild.id}`) || default_prefix;
  if (!message.content.startsWith(`${prefix}afk`)) {
      if (db.has(`afk-${message.author.id}`)) {
          const afkData = db.get(`afk-${message.author.id}`);
          const { content, timestamp } = afkData;
          const duration = Date.now() - timestamp;
          const seconds = Math.floor(duration / 1000);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);

          db.delete(`afk-${message.author.id}`);
          
          const formattedTimestamp = moment.unix(Math.floor(timestamp / 1000)).format('X');

          ctx.embed(`Welcome back! it's been <t:${formattedTimestamp}:R>`);
      }
  }
  const isLevelingEnabled = db.get(`leveling_${message.guild.id}`);
  if (!isLevelingEnabled) return;

  let userLevel = db.get(`level_${message.guild.id}_${message.author.id}`) || 1;
  let userXP = db.get(`xp_${message.guild.id}_${message.author.id}`) || 0;

  const xpPerMessage = 1;

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
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
      api: {
        clientId: "e083a7250c0e49be8d6a1875d862f1b3",
        clientSecret: "b113f76d18d0478a98ba6e61652cc212",
      },
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ]
})
module.exports = client;
const { musicCard } = require("musicard");

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(", ") || "Off"}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? "All Queue" : "This Song") : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

async function sendMusicCard(queue, song) {

  const card = new musicCard()
    .setName(song.name)
    .setAuthor(`${song.user.username}'s request`)
    .setColor("auto")
    .setTheme("classic")
    .setBrightness(50)
    .setThumbnail(song.thumbnail)
    .setProgress(10)
    .setStartTime("0:01")
    .setEndTime(song.formattedDuration);
  const cardBuffer = await card.build();
  fs.writeFileSync(`musicard.png`, cardBuffer);

  const repeat = new ButtonBuilder()
    .setCustomId("repeat")
    .setLabel("Repeat")
    .setStyle(ButtonStyle.Danger);

  const shuffle = new ButtonBuilder()
    .setCustomId("shuffle")
    .setLabel("Shuffle")
    .setStyle(ButtonStyle.Danger);

    const embed22 = new EmbedBuilder()
    .setColor(config.color)
    .setImage('attachment://musicard.png');  // Use 'attachment://' protocol for local files
  
  queue.textChannel.send({
    files: [{ attachment: 'musicard.png', name: 'musicard.png' }],  // Provide the file as an attachment
  }).then((message) => {
    queue.currentMessage = message;
  });
}

client.distube
  .on('playSong', async (queue, song) => {
    if (queue.currentMessage) {
      queue.currentMessage.delete().catch(console.error);
      queue.currentMessage = undefined;
    }

    await sendMusicCard(queue, song);
  })
  .on('addSong', (queue, song) => {
    queue.textChannel.send({ embeds: [{ color: config.color, description: `> Added ${song.name} - \`${song.formattedDuration}\` to the queue` }] });
  })
  .on('addList', (queue, playlist) => {
    queue.textChannel.send({ embeds: [{ color: config.color, description: `> Added \`${playlist.name}\` (${playlist.songs.length} songs) to queue\n${status(queue)}` }] });
  })
  .on('error', (channel, e) => {
    console.error(e);
  })
  .on('empty', (channel) => {
    channel.send({ embeds: [{ color: config.color, description: `> Voice channel is empty! Goodbye...` }] });
  })
  .on('searchNoResult', (message, query) => {
    message.channel.send({ embeds: [{ color: config.color, description: `> No result found for \`${query}\`!` }] });
  })
  .on('finish', (queue) => {
    queue.textChannel.send({ embeds: [{ color: config.color, description: `> Queue ended!`}]}).then((message) => {
      queue.currentMessage = message;
      queue.connection.disconnect();
    });
  });
client.login(token);
