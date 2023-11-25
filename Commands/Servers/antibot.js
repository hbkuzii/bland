const db = require('quick.db');

module.exports = {
    name: "antibot",
    description: "Enable, disable, or check the status of the antibot feature",
    usage: "<enable|disable|status>",
    category: 'Servers',
    execute(message, args) {
        message.channel.sendTyping();
      const action = args[0].toLowerCase();
  
      if (action === 'enable') {
        db.set(`antibot_${message.guild.id}`, true);
        ctx.approve('Antibot feature is now enabled.');
      } else if (action === 'disable') {
        db.set(`antibot_${message.guild.id}`, false);
        ctx.approve('Antibot feature is now disabled.');
      } else if (action === 'status') {
        const isEnabled = db.get(`antibot_${message.guild.id}`);
        if (isEnabled) {
          ctx.approve('Antibot feature is enabled.');
        } else {
          ctx.approve('Antibot feature is disabled.');
        }
      } else {
        ctx.warn('Invalid action. Use `enable`, `disable`, or `status`.');
      }
    },
}