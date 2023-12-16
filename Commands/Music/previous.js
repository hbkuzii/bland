module.exports = {
    name: 'previous',
    aliases: ['prev'],
    description: 'Play the previous song',
    category: 'Music',
    permissions: ['SendMessages'],
    send: false,
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) return ctx.warn(`There is nothing in the queue right now!`);

        const song = queue.previous();
        
        if (!song) return ctx.warn(`No previous song in the queue.`);

        return ctx.embed(`Previous Song: **${song.name}**`);
    }
};
