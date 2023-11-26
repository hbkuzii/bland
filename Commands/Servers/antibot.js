const db = require('quick.db');

module.exports = {
  name: "antibot",
  description: "Enable, disable, or check the status of the antibot feature",
  usage: "(subcommand)",
  parameters: ['\`channel\`'],
  subcommands: '\`antibot enable\` - enable antibot feature\n\`antibot status\` - view antibot settings\n\`antibot disabled\` - disable antibot feature',
  category: 'Servers',
  permissions: ["ManageGuild"],
  execute(message, args) {
    message.channel.sendTyping();
    
    const action = args[0]?.toLowerCase();

    if (action === 'enable' || action === 'disable') {
      db.set(`antibot_${message.guild.id}`, action === 'enable');
      ctx.approve(`${action === 'enable' ? 'Bots are now prohibited from joining the server.' : 'Bots are now able to join and remain in this server'}.`);
    } else if (action === 'status') {
      const isEnabled = db.get(`antibot_${message.guild.id}`);
      ctx.normal(`Antibot feature is ${isEnabled ? 'enabled' : 'disabled'}.`);
    } else {
      ctx.warn('Invalid action. Use `enable`, `disable`, or `status`.');
    }
  },
};
