module.exports = {
    name: "leveling",
    description: "Enable or disable the leveling system",
    usage: "(subcommand)",
    category: 'Servers',
    permissions: ["ManageGuild"],
    parameters: ['\`setting\`'],
    subcommands: [
      {
        name: 'leveling enable',
        description: 'Enable leveling system',
        parameters: ['setting'],
      },
      {
        name: 'leveling disable',
        description: 'Disable leveling system',
        parameters: ['setting'],
      },
    ],
    execute(message, args, client) {
      message.channel.sendTyping();
  
      const action = args[0]?.toLowerCase();
  
      if (action === 'enable' || action === 'disable') {
        db.set(`leveling_${message.guild.id}`, action === 'enable');
        ctx.approve(`Leveling system is now ${action === 'enable' ? 'enabled' : 'disabled'}.`);
      } else {
        ctx.warn('Invalid action. Use `enable` or `disable`.');
      }
    },
  };