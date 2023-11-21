const client = require('../../bland.js')

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
    }
  );
 }
);