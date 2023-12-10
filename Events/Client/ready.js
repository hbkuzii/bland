const chalk = require('chalk');

module.exports = (client) => {
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  console.log(
    `${chalk.gray.bold(`[${timestamp}]`)}${chalk.gray.cyan.bold(` INFO`)}${chalk.magentaBright.bold` [bland]`}` +
    `${chalk.white.bold(` Logged in as ${client.user.tag} with ${client.commands.size} commands`)}`
  );
  module.exports = client;
  client.user.setPresence({
    status: 'dnd',
    activities: {
      type: 'CUSTOM_STATUS',
      name: 'bland status',
      state: 'bland.world/commands',
    },
  });
};