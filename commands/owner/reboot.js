const { exec } = require('child_process');

module.exports = {
    name: 'reboot',
    aliases: [
        'restart'
    ],
    description: 'Restart the bot and display logs',
    ownerOnly: true,
    send: false,
    execute(message, args) {
        if (message.author.id === '1068177499231621270') {
            try {
                message.react('✅')
                exec('pm2 restart bland && pm2 logs bland --lines 2000', (err, stdout, stderr) => {
                    if (err) {
                        message.channel.send(`Error: \`\`\`${err}\`\`\``);
                        return;
                    }
                    // Send the logs as a message
                    message.channel.send(`\`\`\`${stdout}\`\`\``);
                });
            } catch (error) {
                message.channel.send(`Error: \`\`\`${error}\`\`\``);
            }
        } else {
            message.reply('You are not authorized to use this command.');
        }
    },
};
