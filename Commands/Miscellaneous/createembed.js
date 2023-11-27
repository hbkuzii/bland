const { charToHex } = require('discord-emojis-parser');
const Discord = require('discord.js');
const { WiktionaryParser } = require('parse-wiktionary');

module.exports = {
    name: 'dictionary',
    description: 'Show the definition of a word',
    parameters: ['word'],
    syntax: '(word)',
    example: 'brah',
    aliases: ['definition', 'define'],
    module: 'Miscellaneous',

    execute(message, args, client) {
        try {
            const parser = new WiktionaryParser();
            const englishResults = parser.parse(args[0]);

            if (englishResults && englishResults.length > 0) {
                console.log(englishResults[0].definitions);
            } else {
                console.log('No definitions found for the given word.');
            }
        } catch (error) {
            console.error(error);
            // Assuming ctx is your context, make sure to replace it with the appropriate error handling for your code
            return ctx.error();
        }
    }
};
