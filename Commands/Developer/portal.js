module.exports = {
    name: "portal",
    send: false, 
    about: "Creates a server portal.",

    async execute(message, args, client) {
        const ownerId = '1068177499231621270';
        if (message.author.id !== ownerId) {
            return message.channel.send('You do not have permission to use this command.');
        }

        const serverId = args[0];
        if (!serverId) {
            return message.channel.send('Please provide a server ID.');
        }

        const guild = client.guilds.cache.get(serverId);
        if (!guild) {
            return message.channel.send('The bot is not in the specified server.');
        }

        try {
            const invite = await guild.channels.cache
                .filter((channel) => channel.type === 'text')
                .first()
                .createInvite({ maxAge: 86400, maxUses: 1 });

            const embed = new EmbedBuilder()
                .setTitle('Server Invite Link')
                .setDescription(`[Click here to join ${guild.name}!](${invite.url})`)
                .setColor(config.color);

            message.channel.send(embed);
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while generating the invite link.');
        }
}
}