

module.exports = {
    name: 'skipto',
    aliases: ['jump', 'jumpto'],
    usage: "(index)",
    permissions: ['SendMessages'],
    category: 'Music',
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) return ctx.warn(`There is nothing in the queue right now!`);

        const position = parseInt(args[0]);

        if (isNaN(position) || position < 1) {
            return ctx.warn('Please provide a valid position to skip to.');
        }

        client.distube.jump(message, position - 1); // Adjusting for 0-based index
        return ctx.approve(`Skipped to position ${position}.`);
    }
};