const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, UserSelectMenuBuilder } = require("discord.js");
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
const client = require('../../bland.js');

module.exports = {
  name: 'nigga',
  description: 'Show information about commands',
  send: false,
  category: "Developer",
  execute: async (message, args) => {
    const prefix = db.get(`prefix_${message.guild.id}`) || config.default_prefix;
    try {
      const helpEmbed = new EmbedBuilder()
      .setTitle('Help Command')
        .setDescription("\`\`\`bf\n() - required argument\n<> - optional argument\`\`\`\n**introduction**\nUse the menu below to view all the commands\nIf you encounter any problem please join our server")
        .setColor(config.color)
        .setThumbnail("https://media.discordapp.net/attachments/1135176764059025480/1135486711657418872/women.png");
        const commandFiles = fs.readdirSync(path.join(__dirname, '../../Commands'));

        const categories = {};
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
            }
            const commandName = command.name || 'N/A';
            const commandDescription = command.description || 'N/A';
    
            const commandString = command.subcommands ? `[\`${commandName}*\`](https://bland.world)` : `[\`${commandName}\`](https://bland.world)`;
    
            categories[categoryName].push(commandString);
          }
        }    

      const selectMenuOptions = Object.keys(categories).map(category => ({
        label: category,
        description: `Click to see ${category} commands`,
        value: category.toLowerCase(),
      }));

      const row = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Select a category!')
            .addOptions(selectMenuOptions),
        );

      const msg = await message.channel.send({
        embeds: [helpEmbed],
        components: [row],
      });

      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 100000,
      });

      collector.on('collect', (i) => {
        const selectedCategory = i.values[0];
        const selectedCategoryProperCase = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        const selectedCommands = categories[selectedCategoryProperCase] || [];
        console.log('Selected Commands:', selectedCommands);
      
        if (selectedCommands.length > 0) {
          const categoryEmbed = new EmbedBuilder()
          .setThumbnail('https://images-ext-2.discordapp.net/external/ZUvRbmXPkBYA_ewPAq6N5O8XiDMgfGhvxle-pg0d5t0/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/1174748943557595196/e19a765a1b287f3703c113fae2067f3f.webp?format=webp')
            .setDescription(`\`\`\`ini\n[ ${selectedCategory} ]\`\`\``)
            .addFields([{
              name: "\n",
              value: `>>> ${selectedCommands.join('\n')}`,
              inline: true,
            }])
            .setColor(config.color);
      
          i.update({
            embeds: [categoryEmbed],
            components: [row],
          });
        } else {
          console.log('No commands in the selected category.');
        }
      });
         

    } catch (err) {
      console.error(err);
    }
  },
};
