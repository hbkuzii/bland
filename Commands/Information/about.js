const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const client = require('../../bland.js');
const os = require('os')

module.exports = {
  name: 'botinfo',
  aliases: ['bi', 'aboutbot'],
  description: 'Display information about the bot',
  permissions: ['SendMessages'],
  send: false,
  execute(message) {
    const cpus = os.cpus();
    const cpu = cpus[0];
    const total = Object.values(cpu.times).reduce(
      (acc, tv) => acc + tv, 0
  );
    const usage = process.cpuUsage();
const currentCPUUsage = (usage.user + usage.system) * 1000;
    const perc = (currentCPUUsage / total * 100).toFixed(2);
    const botInfoEmbed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('> Bot Information')
      .setDescription(`This bot is created and maintained by curly.\n**Memory**: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100}MB, **CPU**: ${perc}%\n\n**Servers**: ${allguilds},  **Members**: ${allusers},  **Channels**: ${blandchannels}`)

    message.channel.send({ embeds: [botInfoEmbed] });
  },
};
