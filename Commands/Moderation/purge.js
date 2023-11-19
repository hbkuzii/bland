const { EmbedBuilder } = require('discord.js');

module.exports ={
            name: 'purge',
            description: 'Purge messages',
            permissions: ['ManageMessages'],
            usage: '(index)',
            
    async execute(message, args) {
        try {

            const input = parseInt(args[0]);

            let amount;

            if (input === 0) {
                amount = 1;
            } else if (input > 1000) {
                amount = 1000;
            } else {
                amount = input;
            }

            const purger = new Purger(message.channel, amount);

            await message.delete();
            purger.construct();
        } catch (error) {
            return ctx.error(message, 'purge', error);
        }
    }
};

class Purger {
    constructor(channel, amount, condition = () => true) {
        this.channel = channel;
        this.amount = amount;
        this.condition = condition;
        this.processed = 0;
    }

    async construct() {
        this.messages = await this.fetch();

        await this.next();
    }

    async next() {
        while (this.processed < this.amount && this.messages.size > 0) {
            await this.purge();

            this.messages = await this.fetch(this.messages.last().id);
        }
    }

    async fetch(before = null) {
        const messages = await this.channel.messages.fetch({
            limit: 100,
            before: before,
        });

        return messages.filter((message) => this.condition(message));
    }

    async purge() {
        const deletedMessages = this.messages
            .map((message) => message)
            .slice(0, this.amount - this.processed);

        const messageIDs = deletedMessages.map((message) => message.id);

        await this.channel.bulkDelete(messageIDs);

        this.processed += deletedMessages.length;
    }
}
