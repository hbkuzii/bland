const fs = require('fs');
const db = require('quick.db');
const{ PermissionsBitField } = require('discord.js');
const Discord = require('discord.js');
const config = require('../config.json')
const { default_prefix } = require('../config.json')
const client = require('../bland.js')
const chalk = require('chalk');
const { EmbedBuilder } = require('discord.js');
const Paginator = require('../Tools/message/paginator.js')
const Variables = require('../Tools/message/variables.js')
const Parser = require('../Tools/message/parser.js')
const cooldowns = new Discord.Collection();
const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
module.exports = (client) => {
  const commandFolders = fs.readdirSync('./Commands');
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`../Commands/${folder}/${file}`);
      client.commands.set(command.name, command);
      if (command.aliases && Array.isArray(command.aliases)) {
        command.aliases.forEach(alias => {
          client.commands.set(alias, command);
        });
      }
    }
  }
  
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Get current timestamp
  console.log(
    chalk.gray.bold(`[${timestamp}]`) + 
    chalk.gray.cyan.bold(` INFO`) + 
    chalk.magentaBright.bold` [bland]` +
    chalk.white.bold(' Starting bland...')
  );
  global.db = require('quick.db');
  global.paginatorInstance = Paginator;
  global.variablesInstance = Variables;
  global.parserInstance = Parser;
  
  
  const translate = require('@iamtraction/google-translate');
  const translateContent = async (content, chosenLanguage) => {
    if (chosenLanguage && chosenLanguage !== 'en') {
        const translation = await translate(content, { to: chosenLanguage });
        return translation.text;
    } else {
        return content;
    }
};
  client.on('messageCreate', async (message) => {
      try {
          const chosenLanguage1 = await db.get(`language_${message.author.id}`);
  
          const translateAndReply = async (content) => {
              if (chosenLanguage1) {
                  const translation = await translate(content, { to: chosenLanguage1 });
                  return translation.text;
              } else {
                  return content;
              }
          };
  
          global.ctx = {
              send: async (content) => {
                  const translatedContent = await translateAndReply(content);
                  message.reply(`${translatedContent}`);
              },
              embed: async (content) => {
                  const translatedContent = await translateAndReply(content);
                  message.reply({ embeds: [{ color: config.color, description: `> ${translatedContent}` }] });
              },
              approve: async (content) => {
                  const translatedContent = await translateAndReply(content);
                  message.reply({ embeds: [{ color: config.color, description: `> ${translatedContent}` }] });
              },
              warn: async (content) => {
                  const translatedContent = await translateAndReply(content);
                  message.reply({ embeds: [{ color: config.color, description: `> ${translatedContent}` }] });
              },
              normal: async (content) => {
                  const translatedContent = await translateAndReply(content);
                  message.reply({ embeds: [{ color: config.color, description: `${translatedContent}` }] });
              },
              error: async (content) => {
                  const translatedContent = await translateAndReply(content);
                  message.channel.send({
                      embeds: [{
                          color: config.color,
                          description: `An error occurred while processing \`${commandName}\`!\n> Kindly report this issue on the [**support server**](https://discord.gg/bland).`
                      }]
                  });
              },
          };
      } catch (error) {
          console.error(error);
      }
    const prefix = db.get(`prefix_${message.guild.id}`) || default_prefix;

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.replace(prefix, '').trim().split(/ +/);
    const commandName = args.shift().toLowerCase();    
    if (commandName.length === 0) return;
    if (!cooldowns.has(commandName)) {
      cooldowns.set(commandName, new Map());
    }
  
    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    const cooldownAmount = 2500;
  
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
  
      if (now < expirationTime) {
        return;
      }
    }
  
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  
    // Continue with checking if the command exists
    const command = client.commands.get(commandName);
  
    if (!command) {
      ctx.warn(`No Command called "${commandName}" not found!`);
      return;
    }
  
  

    if (command.permissions) {
      const requiredPermissions = command.permissions;
      
      // Check if the command requires permissions for members
      if (message.member) {
        const hasAllPermissions = requiredPermissions.every(permission => message.member.permissions.has(PermissionsBitField.Flags[permission]));
      
        if (!hasAllPermissions) {
          ctx.warn(`You're missing one or more of the following permissions: \`${requiredPermissions.join('\` ,\`')}\` to execute \`${commandName}\`!`);
          return;
        }
      }
    
      // Check if the command requires permissions for bots
      if (message.guild && message.guild.me) {
        const botMissingPermissions = requiredPermissions.filter(permission => !message.guild.me.permissions.has(PermissionsBitField.Flags[permission]));
    
        if (botMissingPermissions.length > 0) {
          ctx.warn(`I'm missing the following permissions: \`${botMissingPermissions.join('\` ,\`')}\` to execute \`${commandName}\`!`);
          return;
        }
      }
    }
    
    

        const parameters = Array.isArray(command.parameters) && command.parameters ? command.parameters.map(param => `\`${param.replace(/`/g, '')}\``).join(', ') : '\`N/A\`';
        const aliases = command.aliases && command.aliases.length > 0 ? command.aliases.map(alias => `${alias}`).join(', ') : '\`N/A\`';
        const usage = command.usage || 'ㅤ';
        const module = command.category || 'Uncategorized';

        if (args.length === 0) {
          if (message.attachments.size === 0) {
            const chosenLanguage1 = await db.get(`language_${message.author.id}`);

            const translateAndReply = async (content) => {
                return await translateContent(content, chosenLanguage1);
            };

              const mainEmbed = new EmbedBuilder()
        .setTitle(`Command: ${await translateAndReply(command.name)} (${await translateAndReply(aliases)})`)
        .setAuthor({ name: `${module}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${await translateAndReply(command.description)}`)
                  .addFields(
                    { name: 'usage', value: `>>> \`\`\`bf\nSyntax ,${await translateAndReply(command.name)} ${await translateAndReply(usage)}\`\`\`` }
                  )
                  .addFields(
                    { name: 'Cooldown', value: `\`2.5s\``, inline: true },
                    { name: 'Parameters', value: `${await translateAndReply(parameters)}`, inline: true },
                      { name: 'Permissions', value: `\`${command.permissions}\``, inline: true }
                  )
                  .setColor(config.color);
      
                  if (command.send === false) {
                    command.execute(message, args, client);
                    console.log(`[${timestamp}] ${message.author.tag} executed command: ${commandName}`);
                    return;
                  }
      
                  if (command && command.subcommands && command.subcommands.length > 0) {
                    const subcommandsText = command.subcommands.map(subcommand => `\`${subcommand.name}\``).join(', ');
        
                    const subcommandsEmbeds = command.subcommands.map((subcommand) => {
                        const subcommandParameters = Array.isArray(subcommand.parameters) ? subcommand.parameters.join(', ') : 'N/A';
                        const subcommandAliases = Array.isArray(subcommand.aliases) ? subcommand.aliases.join(', ') : 'N/A';
                        const subcommandusage = subcommand.usage || 'ㅤ';
                        const subcommandparameters = Array.isArray(command.parameters) && command.parameters.length > 0
                        ?       command.parameters.join(', ').replace(/`/g, ''): 'N/A';   
                        return new EmbedBuilder()
                            .setTitle(`Subcommand: ${subcommand.name} (${subcommandAliases})`)
                            .setAuthor({ name: `${module}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`${subcommand.description}`)
                          .addFields(
                            { name: 'usage', value: `>>> \`\`\`bf\nSyntax ,${subcommand.name} ${subcommandusage}\`\`\`` }
                        )
                        .addFields(
                          { name: 'Parameters', value: `${subcommandparameters}`, inline: true },
                          { name: 'Permissions', value: `${command.permissions}`, inline: true },
                          { name: 'Cooldown', value: `2.5s`, inline: true }
                      )
                            .setColor(config.color);
                    });
        
                    return new paginatorInstance(message, {
                        embeds: [mainEmbed, ...subcommandsEmbeds],
                        text: `Page {page} of {pages}`,
                    }).construct();
                } else {
                  console.log(`[${timestamp}] ${message.author.tag} executed command: ${commandName}`);
                    return message.reply({ embeds: [mainEmbed] });
                }
        
          
              if (command.send === false) {
                command.execute(message, args, client);
                console.log(`[${timestamp}] ${message.author.tag} executed command: ${commandName}`);
                return;
              }
      
        
            if (command.send === false) {
              command.execute(message, args, client);
              console.log(`[${timestamp}] ${message.author.tag} executed command: ${commandName}`);
              return;
            }
               
          }
        }        
    try {
      console.log(`[${timestamp}] ${message.author.tag} executed command: ${commandName}`);
      command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply({ embeds: [{ color: config.color, description: `An error occured while processing \`${commandName}\`!\n> Kindly report this issue on the [**support server**](https://discord.gg/bland).` }] });
    }
    
  });
};