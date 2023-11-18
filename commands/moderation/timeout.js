const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'timeout',
  aliases: ['to'],
  description: 'Timeout a user',
  permissions: ['MuteMembers'],
  category: "Moderation",
  example: "@curly 10m",
  usage: "(member) (duration)",
  execute(message, args) {
    if (!args[0]) {
      return;
    }

    const timeUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const timeMember = message.guild.members.cache.get(timeUser.id);

    if (!timeMember) {
      return ctx.warn('The mentioned user is not in the server.');
    }

    if (timeMember.id === message.author.id) {
      return ctx.warn('You cannot timeout yourself.');
    }

    if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return ctx.warn('You cannot timeout a person with the administrator permission.');
    }

    const rawDuration = args[1];
    const duration = parseDuration(rawDuration);

    if (!duration || isNaN(duration)) {
      return ctx.warn('Please provide a valid duration for the timeout. (\`s\`/\`m\`/\`h\`/\`d\`)');
    }

    const reason = args.slice(2).join(' ') || 'No reason given';

    timeMember.timeout(duration, reason)
      .then(() => {
        ctx.approve(`**${timeUser.user.tag}** has been timed out for ${formatDuration(duration)}`)
        message.reply({ embeds: [embed] });
      })
      .catch(err => {
      });
  },
};

function parseDuration(rawDuration) {
  const parsed = rawDuration.match(/^(\d+)(s|m|h|d)?$/);
  if (!parsed) return null;

  const value = parseInt(parsed[1]);
  const unit = parsed[2];

  if (isNaN(value)) return null;

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
}

function formatDuration(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);

  return parts.join(' ');
}
