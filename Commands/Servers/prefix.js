
module.exports = {
    name: "prefix",
    aliases: [],
    description: "View or change guild prefix",
    usage: "<subcommand> <args>",
    example: "set ;",
    permissions: ['MANAGE_GUILD'],
    send: false,
    parameters: ['\`prefix\`'],
    subcommands: '\`prefix set\` - set the guild prefix\n\`prefix reset\` - reset the guild prefix',
    category: 'Servers',
    execute(message, args) {
      message.channel.sendTyping();
      const currentPrefix = db.get(`prefix_${message.guild.id}`) || `,`;
  
      if (args[0] === "set") {
  
        if (!args[1]) {
          return ctx.warn(`You need to provide a new prefix when using \`prefix set\``);
        }
  
        if (args[1].length > 10) {
          return ctx.warn(`Prefix can't be longer than **10 characters**!`);
        }
  
        db.set(`prefix_${message.guild.id}`, args[1]);
        return ctx.approve(`The prefix has been modified to \`${args[1]}\``);
      }
  
      if (args[0] === "reset") {
        db.delete(`prefix_${message.guild.id}`);
        return ctx.approve(`The prefix has been modified to \`,\``);
      }
      return ctx.normal(`prefix \`${currentPrefix}\``);
    }
  };