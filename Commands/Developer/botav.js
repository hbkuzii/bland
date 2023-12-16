
module.exports = {
    name: 'botav',
    description: 'Change the bot\'s avatar',
    ownerOnly: true,
    category: "Developer",
    async execute(message, args, client) {
        // Check if the user executing the command is the owner
        if (message.author.id === '1068177499231621270') {
            try {
                let avatarURL = args[0];

                // Check if an attachment is present
                if (message.attachments.size > 0) {
                    avatarURL = message.attachments.first().url;
                }

                await client.user.setAvatar(avatarURL);
                message.react('✅');
            } catch (error) {
                console.error(error);
                return message.react('‼️');
            }
        }
    }
};