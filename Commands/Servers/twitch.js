const axios = require('axios');

module.exports = {
    name: "twitch",
    description: "Manage Twitch channels for notifications",
    usage: "(subcommand) (channel) (twitch user)",
    category: 'Servers',
    permissions: ["ManageGuild"],
    parameters: ['\`subcommand\`', '\`channel\`', '\`twitch user\`'],
    subcommands: [
        {
            name: 'twitch clear',
            description: 'Clear all Twitch channels for notifications',
            parameters: [],
        },
        {
            name: 'twitch add',
            description: 'Add a Twitch channel for notifications',
            usage : '(channel) (twitch user)',
            parameters: ['channel', 'twitch user'],
        },
        {
            name: 'twitch message',
            description: 'Set the message content for a Twitch user',
            usage : '(channel) (twitch user)',
            parameters: ['twitch user', 'content'],
        },
        {
            name: 'twitch alerts',
            description: 'List all Twitch channels for notifications',
            parameters: [],
        },
        {
            name: 'twitch remove',
            usage : '(channel) (twitch user)',
            description: 'Remove a Twitch channel for notifications',
            parameters: ['channel', 'twitch user'],
        },
    ],
    async execute(message, args, client) {
        message.channel.sendTyping();

        const subcommand = args[0]?.toLowerCase();

        const twitchChannels = db.get(`twitch_${message.guild.id}`) || [];

        if (subcommand === 'clear') {
            db.delete(`twitch_${message.guild.id}`);
            ctx.approve('Cleared all Twitch channels for notifications.');
        } else if (subcommand === 'add') {
            const channel = args[1];
            const twitchUser = args[2];

            if (channel && twitchUser) {
                const newChannel = { channel, twitchUser };
                twitchChannels.push(newChannel);
                db.set(`twitch_${message.guild.id}`, twitchChannels);
                ctx.approve(`Added Twitch channel ${channel} for notifications for user ${twitchUser}.`);
            } else {
                ctx.warn('Invalid parameters. Use `,twitch add (channel) (twitch user)`.');
            }
        } else if (subcommand === 'message') {
            const twitchUser = args[1];
            const content = args.slice(2).join(' ');

            if (twitchUser && content) {
                db.set(`twitch_message_${message.guild.id}_${twitchUser}`, content);
                ctx.approve(`Set message content for Twitch user ${twitchUser}.`);
            } else {
                ctx.warn('Invalid parameters. Use `,twitch message (twitch user) (content)`.');
            }
        } else if (subcommand === 'alerts') {
            if (twitchChannels.length > 0) {
                const alertList = twitchChannels.map(channel => `${channel.channel} - ${channel.twitchUser}`).join('\n');
                ctx.approve(`Twitch channels for notifications:\n${alertList}`);
            } else {
                ctx.approve('No Twitch channels set for notifications.');
            }
        } else if (subcommand === 'remove') {
            const channel = args[1];
            const twitchUser = args[2];

            const indexToRemove = twitchChannels.findIndex(ch => ch.channel === channel && ch.twitchUser === twitchUser);

            if (indexToRemove !== -1) {
                twitchChannels.splice(indexToRemove, 1);
                db.set(`twitch_${message.guild.id}`, twitchChannels);
                ctx.approve(`Removed Twitch channel ${channel} for notifications for user ${twitchUser}.`);
            } else {
                ctx.warn(`Could not find Twitch channel ${channel} for notifications for user ${twitchUser}.`);
            }
        } else {
            ctx.warn('Invalid subcommand. Use `clear`, `add`, `message`, `alerts`, or `remove`.');
        }
    },
};
