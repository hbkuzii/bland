const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
const client = require('../../bland.js');

module.exports = {
    name: "help",
    category: 'Information',
    send: false,
    aliases: ['h', "commands", "cmds"],
    description: 'Display a list of available commands',
    permissions: ['SendMessages'],
  async execute(message, args, client) {
    const prefix = db.get(`prefix_${message.guild.id}`) || config.default_prefix;
    try {
      const commandFiles = fs.readdirSync(path.join(__dirname, '../../Commands'));

      const categories = {};
      const allCategories = []; // Store all category names

      for (const folder of commandFiles) {
        const folderPath = path.join(__dirname, `../../Commands/${folder}`);
        const commands = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const commandFile of commands) {
          const commandPath = path.join(folderPath, commandFile);
          const command = require(commandPath);

          const categoryName = command.category || 'Other';

          if (categoryName === "Developer") {
            continue;
          }

          if (!categories[categoryName]) {
            categories[categoryName] = [];
            allCategories.push(categoryName); // Add category to the list
          }

          const commandName = command.name || 'N/A';
          const commandDescription = command.description || 'N/A';

          const commandString = command.subcommands ? `${commandName}*` : `${commandName}`;

          categories[categoryName].push(commandString);
        }
      }

      const embeds = Object.entries(categories).map(([category, commands]) => {
        return new EmbedBuilder()
          .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
          .setDescription(`<:next:1163598401124970567> **${category}**`) // Adding backticks around category
          .addFields([{
            name: "\n",
            value: `>>> \`\`\`bf\n${commands.join(', ')}\`\`\``,
            inline: true,
          }])
          .setColor(config.color);
      });
      const description = `[ ${client.commands.size} commands ]`;
const categoryLinks = allCategories.map(category => `> [\`${category}\`](https://bland.world)`).join('\n');
      const firstPage = new EmbedBuilder()
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`\`\`\`bf\n${description}\`\`\`\n\n${categoryLinks}`)
        .setColor(config.color);

      embeds.unshift(firstPage);

      await new paginatorInstance(message, {
        embeds,
        text: `Page {page} of {pages}`,
      }
      ).construct();

    } catch (err) {
      console.error(err);
    }
  },
};
