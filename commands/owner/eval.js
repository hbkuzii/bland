const { inspect } = require('util');
const { PythonShell } = require('python-shell');
const client = require('../../bland.js');

module.exports = {
    name: 'eval',
    description: 'Evaluate JavaScript or Python code',
    ownerOnly: true,
    execute(message, args) {
        // Check if the user executing the command is the owner
        if (message.author.id === '1068177499231621270') {
            try {
                // Join the arguments to form a single string of code
                const code = args.join(' ');

                // Determine if it's Python code or JavaScript code
                const isPython = code.startsWith('py ');

                // Remove 'py ' if it's Python code
                const codeToExecute = isPython ? code.slice(3) : code;

                // Execute the code
                if (isPython) {
                    // Execute Python code using python-shell
                    PythonShell.runString(codeToExecute, null, function (err, resultArr) {
                        if (err) {
                            message.channel.send(`Error: \`\`\`python\n${err}\n\`\`\``);
                        } else {
                            const result = resultArr.join('\n');
                            // Use util.inspect to nicely format the result
                            const formattedResult = inspect(result, { depth: 0 });
                            // Send the result as a message
                            message.channel.send(`\`\`\`python\n${formattedResult}\n\`\`\``);
                        }
                    });
                } else {
                    // Execute JavaScript code
                    let result = eval(codeToExecute);
                    // Use util.inspect to nicely format the result
                    result = inspect(result, { depth: 0 });
                    // Send the result as a message
                    ctx.normal(`\`\`\`js\n${result}\n\`\`\``);
                }
            } catch (error) {
                // If there's an error, send the error message
                ctx.normal(`\`\`\`js\n${error}\n\`\`\``);
            }
        } else {
            // If the user is not the owner, inform them that they are not authorized
            message.reply('You are not authorized to use this command.');
        }
    },
};
