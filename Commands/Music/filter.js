module.exports = {
    name: 'filter',
    aliases: ['filters'],
    description: 'Apply a filter to the queue',
    usage: "(filter)",
    category: 'Music',
    permissions: ['SendMessages'],
    send: false,
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) return ctx.warn(`There is nothing in the queue right now!`);

        const filter = args[0];

        if (filter === 'list') {
            const filterList = Object.entries({
                '3d': 'Apply 3D audio effect',
                bassboost: 'Boost the bass frequencies',
                echo: 'Add echo to the audio',
                flanger: 'Apply a flanger effect',
                gate: 'Apply a gate effect',
                haas: 'Create a Haas effect',
                karaoke: 'Apply karaoke effect',
                nightcore: 'Convert audio to nightcore style',
                reverse: 'Reverse the audio',
                vaporwave: 'Convert audio to vaporwave style',
                mcompand: 'Apply multiband compander effect',
                phaser: 'Apply a phaser effect',
                tremolo: 'Apply a tremolo effect',
                surround: 'Create a surround sound effect',
                earwax: 'Simulate earwax in audio',
            }).map(([name, description]) => `**${name}:** ${description}`);

            return ctx.embed(`List of available filters:\n${filterList.join('\n')}`);
        }

        if (filter === 'off') {
            if (queue.filters.size) {
                queue.filters.clear();
                return ctx.approve(`Filters turned off.`);
            } else {
                return ctx.warn(`Filters are already off.`);
            }
        } else if (Object.keys(client.distube.filters).includes(filter)) {
            if (queue.filters.has(filter)) {
                queue.filters.remove(filter);
                return ctx.approve(`Removed filter: \`${filter}\``);
            } else {
                queue.filters.add(filter);
                return ctx.approve(`Added filter: \`${filter}\``);
            }
        } else if (args[0]) {
            return ctx.warn(`Not a valid filter`);
        } else {
            return ctx.embed(`Current Queue Filter: \`${queue.filters.names.join(', ') || 'Off'}\``);
        }
    }
};
