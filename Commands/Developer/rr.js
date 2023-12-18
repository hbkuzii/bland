const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
const client = require('../../bland.js');

module.exports = {
  name: "wompwomp",
  category: 'Developer',
  send: false,
  description: 'Display a list of available commands',
  permissions: ['SendMessages'],
  async execute(message, args, client) {
    const prefix = db.get(`prefix_${message.guild.id}`) || config.default_prefix;
    try {
      const helpEmbed = new EmbedBuilder()
      .setAuthor({ name: client.user.username , iconURL: client.user.displayAvatarURL() })
      .setDescription(`>>> Choose a category from the menu to see its corresponding commands.`)
      .addFields(
        { name: 'support', value: `> https://discord.gg/bland`, inline: true },
        { name: 'invite', value: `> https://bland.world/invite`, inline: true },
        )
        .setColor(config.color)
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
    
            const commandString = command.subcommands ? `\`${commandName}*\` - ${command.description}` : `\`${commandName}\` - ${command.description}`;
    
            categories[categoryName].push(commandString);
          }
        }    


        const selectMenuOptions = [
          {
            label: 'Home',
            description: 'Click to go back to the main menu',
            value: 'home',
            emoji: '<:home:1184260509231489044>',
          },
          ...Object.keys(categories).map(category => ({
            label: category,
            description: truncateDescription(getCommandsForCategory(category)), // Truncate the description
            value: category.toLowerCase(),
            emoji: getEmojiForCategory(category),
          })),
        ];
        
        function truncateDescription(commands) {
          const maxLength = 100; // Set your desired maximum length
          if (commands.length > maxLength) {
            return commands.substring(0, maxLength - 3) + '...';
          }
          return commands;
        }
        
        function getCommandsForCategory(category) {
          const commands = categories[category] || [];
          return commands.map(command => command.split('`')[1]).join(', ');
        }
        
        function getEmojiForCategory(category) {
          const emojiMap = {
            'Moderation': '<:moderation:1184257704739479645>',
            'Information': '<:information:1184257165775613972>',
            'Servers': '<:config:1184258470820724786>',
            'Miscellaneous': '<:miscellaneous:1184259190382927874>',
            'Music': '<:music:1185372121057218650>'
          };
        
          return emojiMap[category] || '❓';
        }
      const row = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Select a category!')
            .addOptions(selectMenuOptions),
        );

        const supportAndInviteRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Support')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/bland'),
          new ButtonBuilder()
            .setLabel('Invite')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/api/oauth2/authorize?client_id=1174748943557595196&permissions=8&scope=bot')
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
        if (i.user.id !== message.author.id) {
          i.reply({
            content: "You can't interact with this menu. It's intended for the message author.",
            ephemeral: true,
          });
          return;
        }
        const selectedCategory = i.values[0];
        if (selectedCategory === 'home') {
          i.update({
            embeds: [helpEmbed],
            components: [row],
          });
          return;
        }
        console.log(selectedCategory)
        const selectedCategoryProperCase = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
        const selectedCommands = categories[selectedCategoryProperCase] || [];
        console.log('Selected Commands:', selectedCommands);
      
        if (selectedCommands.length > 0) {
          const categoryEmbed = new EmbedBuilder()
          .setAuthor({ name: client.user.username , iconURL: client.user.displayAvatarURL() })
          .setThumbnail('https://images-ext-2.discordapp.net/external/ZUvRbmXPkBYA_ewPAq6N5O8XiDMgfGhvxle-pg0d5t0/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/1174748943557595196/e19a765a1b287f3703c113fae2067f3f.webp?format=webp')
            .setDescription(`<:next:1163598401124970567> **${selectedCategory}**`)
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