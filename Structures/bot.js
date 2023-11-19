const fs = require('fs');
const db = require('quick.db');
const{ PermissionsBitField } = require('discord.js');
const Discord = require('discord.js');
const config = require('../config.json')
const { default_prefix } = require('../config.json')
const chalk = require('chalk');
const { EmbedBuilder } = require('discord.js');
const cooldowns = new Discord.Collection();
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
  
  
  client.on('messageCreate', message => {
    

    global.ctx = {
      send: (content) => {
        message.reply(`${content}`);
      },
      embed: (content) => {
        message.reply({ embeds: [{ color: config.color, description: `> ${message.author}: ${content}` }] });
      },
      approve: (content) => {
        message.reply({ embeds: [{ color: config.color, description: `> ${message.author}: ${content}` }] });
      },
      warn: (content) => {
        message.reply({ embeds: [{ color: config.color, description: `> ${message.author}: ${content}` }] });
      },
      normal: (content) => {
        message.reply({ embeds: [{ color: config.color, description: `${content}` }] });
      },
    };
    
    const prefix = db.get(`prefix_${message.guild.id}`) || default_prefix;

    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
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
  const hasPermission = message.member && message.member.permissions.has(PermissionsBitField.Flags[requiredPermissions]);
  if (!hasPermission) {
    ctx.warn(`You lack the permission \`${requiredPermissions.join(', ')}\` to execute the \`${commandName}\` command!`);
    return;
  }
}

        const parameters = Array.isArray(command.parameters) && command.parameters.length > 0
?       command.parameters.join(', ').replace(/`/g, ''): 'N/A';      
        const aliases = command.aliases && command.aliases.length > 0 ? command.aliases.map(alias => `${alias}`).join(', ') : '\`N/A\`';
        const usage = command.usage || 'N/A';
        const module = command.category || 'Uncategorized';

        if (args.length === 0) {
          if (message.attachments.size === 0) {
            const embed = new EmbedBuilder()
              .setTitle(`Command: ${command.name} (${aliases})`)
              .setAuthor({ name: `${module}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
              .setDescription(`${command.description}`)
              .addFields(
                { name: 'usage', value: `>>> \`\`\`bf\nSyntax ,${command.name} ${usage}\`\`\``, inline: true})
                .setFooter({ text: `Module: ${module}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

              .setTimestamp()
              .setColor(config.color);
        
            if (command.subcommands && command.subcommands.length > 0) {
              embed.addFields({ name: 'Subcommands', value: `>>> ${command.subcommands.replace(/`/g, '')}`});
            }
        
            if (command.send === false) {
              command.execute(message, args);
              return;
            }
            
            return message.reply({ embeds: [embed] });
               
          }
        }        
    try {
      const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Get current timestamp
      console.log(`[${timestamp}] ${message.author.tag} executed command: ${commandName}`);
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply({ embeds: [{ color: config.color, description: `An error occured while processing \`${commandName}\`!\n> Kindly report this issue on the [**support server**](https://discord.gg/bland).` }] });
    }
    
  });
  client.on('messageUpdate', (oldMessage, newMessage) => {
    global.ctx = {
      send: (content) => {
        message.reply(`${content}`);
      },
      embed: (content) => {
        message.reply({ embeds: [{ color: config.color, description: `> ${message.author}: ${content}` }] });
      },
      approve: (content) => {
        message.reply({ embeds: [{ color: config.color, description: `> ${message.author}: ${content}` }] });
      },
      warn: (content) => {
        message.reply({ embeds: [{ color: config.color, description: `> ${message.author}: ${content}` }] });
      }
    };
    
    const prefix = db.get(`prefix_${newMessage.guild.id}`) || default_prefix;
    
    if (!newMessage.content.startsWith(prefix) || newMessage.author.bot) return;
  
    const args = newMessage.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
    const command = client.commands.get(commandName);
  
    if (!command) {
      ctx.warn(`No Command called "${commandName}" not found!`);
      return;
    }
  
  
  if (command.permissions) {
  const requiredPermissions = command.permissions;
  const hasPermission = newMessage.member && newMessage.member.permissions.has(PermissionsBitField.Flags[requiredPermissions]);
  if (!hasPermission) {
    ctx.warn(`You lack the permission \`${requiredPermissions.join(', ')}\` to execute the \`${commandName}\` command!`);
    return;
  }
  }
  
        const parameters = Array.isArray(command.parameters) && command.parameters.length > 0
  ?       command.parameters.join(', ').replace(/`/g, ''): 'N/A';      
        const aliases = command.aliases && command.aliases.length > 0 ? command.aliases.map(alias => `${alias}`).join(', ') : '\`N/A\`';
        const usage = command.usage || 'N/A';
        const module = command.category || 'Uncategorized';
  
        if (args.length === 0) {
          if (newMessage.attachments.size === 0) {
            const embed = new EmbedBuilder()
              .setTitle(`Command: ${command.name} (${aliases})`)
              .setAuthor({ name: `${module}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
              .setDescription(`${command.description}`)
              .addFields(
                { name: 'module', value: `>>> \`\`\`bf\nSyntax ,${command.name} ${usage}\`\`\``, inline: true})
                .setFooter({ text: `Module: ${module}`, iconURL: newMessage.author.displayAvatarURL({ dynamic: true }) })
  
              .setTimestamp()
              .setColor(config.color);
        
            if (command.subcommands && command.subcommands.length > 0) {
              embed.addFields({ name: 'Subcommands', value: `>>> ${command.subcommands.replace(/`/g, '')}`});
            }
        
            if (command.send === false) {
              command.execute(newMessage, args);
              return;
            }
            
            newMessage.reply({ embeds: [embed] });
               
          }
        }        
    try {
      const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      console.log(`[${timestamp}] ${newMessage.author.tag} executed command: ${commandName}`);
      command.execute(newMessage, args);
    } catch (error) {
      console.error(error);
      newMessage.reply({ embeds: [{ color: config.color, description: `An error occured while processing \`${commandName}\`!\n> Kindly report this issue on the [**support server**](https://discord.gg/bland).` }] });
    }
  });
};