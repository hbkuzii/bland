global.ctx = {
    send: (content) => {
      message.reply(`${content}`);
    },
    embed: (content) => {
      message.reply({ embeds: [{ color: config.color, description: `> ${content}` }] });
    },
    approve: (content) => {
      message.reply({ embeds: [{ color: 7632269, description: `> ${content}` }] });
    },
    warn: (content) => {
      message.reply({ embeds: [{ color: 7632269, description: `> ${content}` }] });
    },
    normal: (content) => {
      message.reply({ embeds: [{ color: config.color, description: `${content}` }] });
    },
    error: (content) => {
      message.reply({ embeds: [{ color: config.color, description: `An error occured while processing \`${commandName}\`!\n> Kindly report this issue on the [**support server**](https://discord.gg/bland).` }] });
    },
  };