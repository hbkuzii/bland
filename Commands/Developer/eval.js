const { inspect } = require('util');
const { PythonShell } = require('python-shell');
const client = require('../../bland.js');

module.exports = {
    name: 'eval',
    description: 'Evaluate JavaScript or Python code',
    ownerOnly: true,
    send: false,
    category: "Developer",
    async execute(message, args, client) {
        // Check if the user executing the command is the owner
        if (message.author.id === '1068177499231621270') {
            const script = args.join(' ').replace('```', '');

            try {
                var evaluated;

                try {
                    evaluated = await eval(script);
                } catch (error) {
                    console.error(error);
                    return message.react('‼️');
                }

                if (typeof evaluated !== 'string') evaluated = require('util').inspect(evaluated);

                message.react('✅');

                if (evaluated.length > 2000) {
                    const buffer = Buffer.from(evaluated, 'utf-8');

                    message.channel.send({
                        files: [
                            {
                                attachment: buffer,
                                name: 'code.txt'
                            }
                        ]
                    });
                } else {
                    message.channel.send(evaluated);
                }
            } catch (error) {
                return new bot.error(
                    message, 'evaluate', error
                );
            }
        }
    }
};
