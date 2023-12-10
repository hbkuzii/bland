const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, UserSelectMenuBuilder } = require("discord.js");
const config = require('../../config.json');

module.exports = {
  name: 'moderate',
  aliases: ['mod', "modpanel"],
  description: 'Open a moderation panel for banning or kicking a user',
  permissions: ['BanMembers', 'KickMembers'],
  category: 'Moderation',
  example: 'moderate (member)',
  usage: '@curly',
  async execute(message, args, client) {
    message.channel.sendTyping();

    const targetUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!targetUser) {
      return message.channel.send('User not found. Please mention a valid user or provide a valid user ID.');
    }
    if (!targetUser) {
        return ctx.warn('The mentioned user is not in the server.');
      }
  
      if (targetUser.id === message.author.id) {
        return ctx.warn('You cannot moderate yourself.');
      }
  
      if (targetUser.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return ctx.warn('You cannot moderate a person with the administrator permission.');
      }
  
    const moderationOptions = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('moderationMenu')
          .setPlaceholder('Select an action')
          .addOptions([
            {
              label: 'Ban',
              value: 'ban',
              description: `Permanently ban a ${targetUser.user.username} from the server.`,
            },
            {
              label: 'Kick',
              value: 'kick',
              description: `Kick a ${targetUser.user.username} from the server.`,
            },
          ])
      );

      const moderationMessage = await message.reply({
        embeds: [
          new EmbedBuilder({
            author : {
                name : 'bland',
                iconURL : client.user.displayAvatarURL()
            },
            description: `> Moderate the actions of ${targetUser} below`,

          }).setColor(config.color),
        ],
        components: [moderationOptions],
      });
      

    const filter = (interaction) =>
      interaction.customId === 'moderationMenu' && interaction.user.id === message.author.id; {}

    const collector = moderationMessage.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (interaction) => {
        const action = interaction.values[0];
        const reason = 'No reason given';
      
        if (action === 'ban') {
          const reason = args.slice(1).join(' ') || 'No reason given';
      
          const embed = new EmbedBuilder()
            .setTitle('**Banned**')
            .setDescription(`> You've been banned from ${message.guild.name}`)
            .addFields({ name: `**Moderator**`, value: `${message.author.tag}`, inline: true })
            .addFields({ name: `**Reason**`, value: `${reason}`, inline: true })
            .setColor(config.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) });
      
          targetUser.send({ embeds: [embed] })
            .then(() => {
              targetUser.ban({ reason, days: 7 })
                .then(() => {
                interaction.reply({ embeds: [{ color: config.color, description: `> **${targetUser.user.tag}** has been banned. Reason: ${reason}` }] });
                })
                .catch(err => {
                  console.error(err);
                  if (err.code === 50013) {
                   return interaction.reply({ embeds: [{ color: config.color, description: `> I do not have the necessary permissions to ban **${targetUser.user.tag}**.` }] });
                  } else if (err.code === 50051) {
                    return interaction.reply({ embeds: [{ color: config.color, description: `> I cannot ban **${targetUser.user.tag}** due to role hierarchy.` }] });
                  } else {
                    ctx.error()
                  }
                });
            });
      } else if (action === 'kick') {
        const reason = args.slice(1).join(' ') || 'No reason given';

        const embed = new EmbedBuilder()
          .setTitle('**Kicked**')
          .setDescription(`> You've been kicked from ${message.guild.name}`)
          .addFields({ name: `**Moderator**`, value: `${message.author.tag}`, inline: true })
          .addFields({ name: `**Reason**`, value: `${reason}`, inline: true })
          .setColor(config.color)
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })});  
           targetUser.send({ embeds: [embed] })
          .then(() => {
            targetUser.kick(reason)
            interaction.reply({ embeds: [{ color: config.color, description: `> **${targetUser.user.tag}** has been kicked. Reason: ${reason}` }] });
          })
          .catch(err => {
            console.error(err);
            if (err.code === 50013) {
                return interaction.reply({ embeds: [{ color: config.color, description: `> I do not have the necessary permissions to kick **${targetUser.user.tag}**.` }] });
            } else if (err.code === 50051) {
                return interaction.reply({ embeds: [{ color: config.color, description: `> I cannot kick **${targetUser.user.tag}** due to role hierarchy.` }] });
            } else {
              ctx.error();
            }
          })
          .finally(() => {
            targetUser.send({ embeds: [embed] })
            interaction.reply({ embeds: [{ color: config.color, description: `> **${targetUser.user.tag}** has been kicked. Reason: ${reason}` }] });
          });
      }
    });

    collector.on('end', () => {
      moderationMessage.edit({ components: [] });
    });
  },
};
