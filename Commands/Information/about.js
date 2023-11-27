const { charToHex } = require('discord-emojis-parser')
const os = require('os')
const {  EmbedBuilder } = require('discord.js')
const config = require('../../config.json');

module.exports = {
        name: 'about',
            description : 'Show system information about blair.',
            aliases : [ 'botinfo', 'system', 'sys' ],
            module : 'Information',
            send: false,
            async execute(message, args, client) {
        try {
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
            message.channel.send({
                embeds : [
                    new EmbedBuilder({
                        author : {
                            name : 'bland',
                            iconURL : client.user.displayAvatarURL()
                        },
                        description : `Developed by **curly**\n**Memory**: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100}MB, **CPU**: ${perc}%`,
                        fields : [
                            {
                                name : 'Members',
                                value : `**Total**: ${members.toLocaleString()}\n**Unique**: ${client.users.cache.size.toLocaleString()}`,
                                inline : true
                            },
                            {
                                name : 'Channels',
                                value : `**Total**: ${channels.toLocaleString()}\n**Text**: ${textChannels.toLocaleString()}\n**Voice**: ${voiceChannels.toLocaleString()}`,
                                inline : true
                            },
                            {
                                name : 'Client',
                                value : `**Servers**: ${guilds.toLocaleString()}\n**Commands**: ${(client.commands.size).toLocaleString()}`,
                                inline : true
                            }
                        ]
                    }).setColor(config.color)
                ]
            })
        } catch (error) {
          console.error(error)
            return ctx.error()
        }
    }
}