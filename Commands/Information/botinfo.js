const os = require('os')
const config = require('../../config.json');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
        name: 'about',
        description : 'Show system information about bland.',
        send: false,
        aliases : [ 'botinfo', 'system', 'sys' ],
        module : 'Information',

    async execute(message, args, client) {
        try {
            message.channel.sendTyping()
            const members = client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0)
            const channels = client.channels.cache.size, textChannels = client.channels.cache.filter((channel) => channel.type ===  0).size, voiceChannels = client.channels.cache.filter((channel) => channel.type ===  2).size
            const guilds = client.guilds.cache.size

            const cpus = os.cpus();
const cpu = cpus[0];

const total = Object.values(cpu.times).reduce(
    (acc, tv) => acc + tv, 0
);

const usage = process.cpuUsage();
const currentCPUUsage = (usage.user + usage.system) * 1000;

const perc = (currentCPUUsage / total * 100).toFixed(2);
const button = new ButtonBuilder()
  .setLabel('support')
  .setStyle(ButtonStyle.Link)
  .setURL('https://discord.gg/bland');

const button1 = new ButtonBuilder()
  .setLabel('invite')
  .setStyle(ButtonStyle.Link)
  .setURL('https://discord.com/api/oauth2/authorize?client_id=1174748943557595196&permissions=8&scope=bot');

const actionRow = new ActionRowBuilder()
  .addComponents(button, button1);
            message.channel.send({
                components: [actionRow],
                embeds : [
                    new EmbedBuilder({
                        author : {
                            name : 'bland',
                            iconURL : client.user.displayAvatarURL()
                        },
                        description : `developed and managed by [curly](https://discord.com/users/1068177499231621270) & [lucky](https://discord.com/users/461914901624127489)\n**Memory**: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100}MB, **CPU**: ${perc}%`,
                        fields : [
                            {
                                name : 'Client',
                                value : `>>> **Members**: ${members.toLocaleString()}\n**Servers**: ${guilds.toLocaleString()}\n**Commands**: ${(client.commands.size).toLocaleString()}`,
                                inline : true
                            },
                        ]
                    }).setColor(config.color).setFooter({text: 'bland - v0.1'})
                ]
            })
        } catch (error) {
            console.error(error)
            return ctx.error()
        }
    }
}