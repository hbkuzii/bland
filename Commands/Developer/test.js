const { MessageEmbed, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json')

module.exports = {
  name: 'test',
  description: 'Display all available commands',
  send: false,
  category: "Developer",
  execute(message, args) {
    const prefix = db.get(`prefix_${message.guild.id}`) || config.default_prefix;
    const commandFiles = fs.readdirSync(path.join(__dirname, '../../Commands'));

    const categories = {};
    for (const folder of commandFiles) {
      const folderPath = path.join(__dirname, `../../Commands/${folder}`);
      const commands = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

      for (const commandFile of commands) {
        const commandPath = path.join(folderPath, commandFile);
        const command = require(commandPath);

        const categoryName = command.category || 'Other';

        // Skip commands with the "Developer" category
        if (categoryName === "Developer") {
          continue;
        }

        if (!categories[categoryName]) {
          categories[categoryName] = [];
        }
        const commandName = command.name || 'N/A';
        const commandDescription = command.description || 'N/A';

        // Check if the command has subcommands
        const commandString = command.subcommands ? `\`${commandName}*\`` : `\`${commandName}\``;

        categories[categoryName].push(commandString);
      }
    }

    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setDescription(`premium bot to avail your community.\n**@mention** me or use \`${prefix}(command)\` to get started.\n> \`()\` - Required Argument\n> \`<>\` - Optional Argument\nUse \`${prefix}help (command)\` for more information on a command.`)
      .setTimestamp()

    for (const [category, commands] of Object.entries(categories)) {
      embed.addFields({ name: category, value: commands.join(', ') });
    }

    message.reply({ embeds: [embed] });
  },
};
