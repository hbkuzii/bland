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
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const ffmpeg = require('fluent-ffmpeg');

let originalFilePath; // Declare the variable outside the block
const FormData = require('form-data');

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.attachments.size > 0) {
    const attachment = message.attachments.first();

    // Check if the file ends with ".ogg"
    if (attachment.name.endsWith('.ogg')) {
      try {
        // Set the value of originalFilePath
        const originalFilePath = path.join(__dirname, attachment.name);
        console.log('File path:', originalFilePath);
        const originalAudioData = await axios.get(attachment.url, { responseType: 'arraybuffer' });

        if (!originalAudioData.data || !originalAudioData.data.length) {
          console.error('Error: Empty or invalid audio data');
          return;
        }

        fs.writeFile(originalFilePath, Buffer.from(originalAudioData.data), async (err) => {
          if (err) {
            console.error('Error writing original audio file:', err);
          } else {
            // Convert .ogg to .mp3 using ffmpeg
            const convertedFilePath = path.join(__dirname, 'converted.mp3');
            await new Promise((resolve, reject) => {
              ffmpeg()
                .input(originalFilePath)
                .audioCodec('libmp3lame')
                .toFormat('mp3')
                .on('end', resolve)
                .on('error', reject)
                .save(convertedFilePath);
            });

            // Use axios to send a POST request to OpenAI for transcription
            const formData = new FormData();
            formData.append('model', 'whisper-1');
            formData.append('file', fs.createReadStream(convertedFilePath));

            const openaiResponse = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
              headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer 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`, // Replace with your actual OpenAI API key
              },
            });

            const transcript = openaiResponse.data.transcription;

            // Do something with the transcript (e.g., send it back to Discord)
            console.log('Transcript:', transcript);
            message.reply(`Transcript: ${transcript}`);
          }
        });
      } catch (error) {
        console.error('Error processing audio file:', error);
      }
    }
  }
});
client.login(token);
