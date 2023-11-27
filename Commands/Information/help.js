const { MessageEmbed, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

module.exports = {
  name: "help",
  category: 'Information',
  send: false,
  aliases: ['h', "commands", "cmds"],
  description: 'Display a list of available commands',
  permissions: ['SendMessages'],
  execute(message, args, client) {
    message.channel.sendTyping();
    const commandFiles = fs.readdirSync(path.join(__dirname, '../../Commands'));

    const categories = {};

    for (const folder of commandFiles) {
      const folderPath = path.join(__dirname, `../../Commands/${folder}`);
      const commands = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

      for (const commandFile of commands) {
        const commandPath = path.join(folderPath, commandFile);
        const command = require(commandPath);

        const categoryName = command.category || 'Other'
        if (!categories[categoryName]) {
          categories[categoryName] = [];
        }

        const commandName = command.name || 'N/A';
        const commandDescription = command.description || 'N/A';

        categories[categoryName].push(`**${commandName}**: ${commandDescription}`);
      }
    }

      ctx.normal(`>>> [**bland.world**](https://bland.world)\n[**bland.world/help**](https://bland.world/help)\n[**bland.world/discord**](https://bland.world/discord)`)

    // for (const [category, commands] of Object.entries(categories)) {
      // embed.addFields({ name: category, value: commands.join('\n') });
   // }

    // message.reply({ embeds: [embed] });
  },
};
