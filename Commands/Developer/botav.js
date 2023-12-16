const { MessageAttachment } = require('discord.js');

module.exports = {
    name: 'botav',
    description: 'Get the avatar of the bot',
    ownerOnly: true,
    send: false,
    category: "Developer",
    async execute(message, args, client) {
        // Check if the user executing the command is the owner
        if (message.author.id === '1068177499231621270') {
            const botAvatar = client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });

            // Send the bot's avatar as an attachment
            const attachment = new MessageAttachment(botAvatar, 'bot_avatar.png');
            message.channel.send(attachment);
        }
    }
};
