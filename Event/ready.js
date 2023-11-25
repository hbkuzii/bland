const client = require('../../bland')

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