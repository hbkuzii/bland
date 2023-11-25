const Discord = require("discord.js");
const db = require("quick.db");
const config = require('../../config.json')

module.exports = {
  name: "discrim",
  aliases: ['tags'],
  permissions: ["ManageGuild"],
  description: "Manage discrim/tags settings",
  usage: "(subcommand) <args>",
  example: "channel #tags",
  category: "Servers",
  parameters: ['\`channel\`'],
  subcommands: "`discrim channel` - set the discrim channel\n`discrim clear` - clear the discrim channel",
  execute(message, args) {
    message.channel.sendTyping();
    const prefix = db.get(`prefix_${message.guild.id}`) || `,`;

    if (args[0] === "clear") {
      db.delete(`discrimchannel_${message.guild.id}`);
      return ctx.approve("The discrim channel has been cleared");
    }
    if (args[0] === "channel") {
      let channel = message.mentions.channels.first();
      const fetched = db.get(`discrimchannel_${message.guild.id}`);
      if (fetched) {
        return ctx.warn("Discrim/tags channel is already set up in this guild");
      }
      if (!channel) {
        return ctx.warn(`To set the discrim/tags channel, type \`${prefix}discrim channel #channel\``);
      }
      db.set(`discrimchannel_${message.guild.id}`, channel.id);
      ctx.approve(`Discrim/tags channel set to ${channel}`);
    }
  },
};
