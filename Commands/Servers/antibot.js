const db = require('quick.db');

module.exports = {
  name: "antibot",
  description: "Enable, disable, or check the status of the antibot feature",
  usage: "(subcommand)",
  parameters: ['\`channel\`'],
  category: 'Servers',
  permissions: ["ManageGuild"],
  subcommands : [
    {
        name : 'antibot enable',
        description : 'enable antibot feature',
        parameters : [ 'setting' ],
    },
    {
        name : 'antibot disable',
        description : 'disable antibot feature',
        parameters : [ 'setting' ],
    },
    {
    name : 'antibot status',
    description : 'view antibot settings',
    parameters : [ 'setting' ],
}
],
  execute(message, args, client) {
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
