const db = require('quick.db');
const Discord = require('discord.js');

module.exports = {
    description: 'Set an AFK status for when you are mentioned',
    name: 'afk',
    category: "Miscellaneous",
    usage: "(reason)",
    send: false,
    execute(message, args, client) {
        const content = args.join(" ") ? args.join(' ') : "AFK";
        const afkKey = `afk-${message.author.id}`;
        const timestamp = Date.now(); 

        db.set(afkKey, { content, timestamp });

        ctx.embed(`set you as away, most likely due to: **${content}**`)
         return;
    }
};
