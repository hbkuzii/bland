const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'role',
  aliases: ["setrole", "assignrole", "r"],
  description: 'Assign or remove a role to/from a user',
  permissions: ['ManageRoles'],
  category: "Moderation",
  example: "role @user RoleName",
  usage: "(member) (role)",
  execute(message, args, client) {
    message.channel.sendTyping();
    let targetUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!targetUser) {
      const username = args.join(' ').toLowerCase();
      const foundMember = message.guild.members.cache.find((member) =>
        member.user.username.toLowerCase() === username ||
        member.displayName.toLowerCase() === username
      );
    
      if (foundMember) {
        targetUser = foundMember;
      } else {
        return ctx.warn('User not found. Please mention a valid user or provide a valid user ID.');
      }
    }

    const targetMember = message.guild.members.cache.get(targetUser.id);

    if (!targetMember) {
      return ctx.warn('The mentioned user is not in the server.');
    }

    const roleName = args.slice(1).join(' ');

    const role = message.guild.roles.cache.find(role => role.name === roleName || role.toString() === roleName);

    if (!role) {
      return ctx.warn('Role not found. Please provide a valid role name.');
    }

    if (targetMember.roles.cache.has(role.id)) {
      targetMember.roles.remove(role)
        .then(() => {
          ctx.approve(`${role.toString()} has been removed from ${targetUser.user.toString()}`);
        })
        .catch(err => {
          console.error(err);
          ctx.warn(`An error occurred while trying to remove the role from the user.`);
        });
    } else {
      targetMember.roles.add(role)
        .then(() => {
          ctx.approve(`${role.toString()} has been assigned to ${targetUser.user.toString()}`);
        })
        .catch(err => {
          console.error(err);
          ctx.warn(`An error occurred while trying to assign the role to the user.`);
        });
    }
  },
};
