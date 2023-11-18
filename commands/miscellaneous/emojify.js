const client = require('../../bland.js');

module.exports = {
  name: 'emojify',
  description: 'Emojify a message',
  permissions: ['SendMessages'],
  usage: "(text)",
  example: "hello world",
  category: "miscellaneous",
  execute(message, args) {
    if (!args[0]) {
      return;
    }

    const emojifiedMessage = emojifyText(args.join(' '));
    message.reply(emojifiedMessage);
  },
};

function emojifyText(text) {
  const emojified = text
    .split('')
    .map(char => {
      if (char === ' ') {
        return '   ';
      }

      const emoji = getEmoji(char.toLowerCase());
      return emoji ? `${emoji} ` : char;
    })
    .join('');

  return emojified;
}

function getEmoji(char) {
    if (/^[a-zA-Z]$/.test(char)) {
      return `:regional_indicator_${char.toLowerCase()}:`;
    return null;
  }
  

  return emojiMap[char] || null;
}
