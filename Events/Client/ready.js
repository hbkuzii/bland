const chalk = require('chalk');
const { ActivityType } = require('discord.js');

module.exports = (client) => {
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  console.log(
    `${chalk.gray.bold(`[${timestamp}]`)}${chalk.gray.cyan.bold(` INFO`)}${chalk.magentaBright.bold` [bland]`}` +
    `${chalk.white.bold(` Logged in as ${client.user.tag} with ${client.commands.size} commands`)}`
  );
  client.user.setPresence({
    status: 'dnd',
    activities: [{
      type: ActivityType.Custom,
      name: 'blandstatus',
      state: 'bland.world/commands'
     }]
    })
};