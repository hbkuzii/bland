const validLanguages = [ 'ab', 'aa', 'af', 'ak', 'sq', 'am', 'ar', 'an', 'hy', 'as', 'av', 'ae', 'ay', 'az', 'bm', 'ba', 'eu', 'be', 'bn', 'bh', 'bi', 'bs', 'br', 'bg', 'my', 'ca', 'ch', 'ce', 'ny', 'zh', 'cv', 'kw', 'co', 'cr', 'hr', 'cs', 'da', 'dv', 'nl', 'dz', 'en', 'eo', 'et', 'ee', 'fo', 'fj', 'fi', 'fr', 'ff', 'gl', 'ka', 'de', 'el', 'gn', 'gu', 'ht', 'ha', 'he', 'hz', 'hi', 'ho', 'hu', 'ia', 'id', 'ie', 'ga', 'ig', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'kl', 'kn', 'kr', 'ks', 'kk', 'km', 'ki', 'rw', 'ky', 'kv', 'kg', 'ko', 'ku', 'kj', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'gv', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mh', 'mn', 'na', 'nv', 'nb', 'nd', 'ne', 'ng', 'nn', 'no', 'ii', 'nr', 'oc', 'oj', 'cu', 'om', 'or', 'os', 'pa', 'pi', 'fa', 'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'sa', 'sc', 'sd', 'se', 'sm', 'sg', 'sr', 'gd', 'sn', 'si', 'sk', 'sl', 'so', 'st', 'es', 'su', 'sw', 'ss', 'sv', 'ta', 'te', 'tg', 'th', 'ti', 'bo', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'cy', 'wo', 'fy', 'xh', 'yi', 'yo', 'za', 'zu' ]

module.exports = {
    name: "language",
    aliases: [],
    description: "Set the main language for the bot",
    usage: "<subcommand> <language>",
    example: "set english",
    permissions: ["SendMessages"],
    send: false,
    parameters: ['\`language\`'],
    category: 'Settings',
    subcommands: [
        {
            name: 'language set',
            description: 'set your main language for the bot',
            parameters: ['language'],
            usage: '(language)',
            example: 'set english',
        },
    ],
    execute(message, args, client) {
        message.channel.sendTyping();

        const currentLanguage = db.get(`language_${message.author.id}`) || 'english';

        if (args[0] === "set") {

            if (!args[1]) {
                return ctx.warn(`You need to provide a language when using \`language set\``);
            }

            const chosenLanguage = args.slice(1).join(' ').toLowerCase();

            if (!validLanguages.includes(chosenLanguage)) {
                return ctx.warn(`Invalid language! **Note: Use language abbreviations.**`);
            }

            db.set(`language_${message.author.id}`, chosenLanguage);
            return ctx.approve(`The main language has been set to \`${chosenLanguage}\``);
        }

        return ctx.embed(`Current main language: \`${currentLanguage}\``);
    }
};
