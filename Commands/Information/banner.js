const config = require('../../config.json');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
   name: 'banner',
   description: 'Display a members banner',
   usage: '<member>',
   send: false,
   category: 'Information',
    async execute(message, args, client) {
      
      message.channel.sendTyping()
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => (r.user.username.toLowerCase() === args.join(' ').toLowerCase() || r.displayName.toLowerCase() === args.join(' ').toLowerCase())) || message.member;
        
        if (!member) {
          ctx.normal("User not found!");
          return;
        }
        if(!member) return this.invalidUser(message)
        let response = fetch(`https://discord.com/api/v8/users/${member.id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${config.token}`
            }
        })
        
        response.then(a => {
            a.json().then(data => {
                let receive = data['banner']
                let response1 = fetch(`https://cdn.discordapp.com/banners/${member.id}/${receive}.gif`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bot ${config.token}`
                    }
                })
                response1.then(b => {
                    if (b.status == 415) {
                        banner = `https://cdn.discordapp.com/banners/${member.id}/${receive}.png?size=1024`
                    } else {
                        banner = `https://cdn.discordapp.com/banners/${member.id}/${receive}.gif?size=1024`
                    }
                    if(receive === null && data['banner_color'] !== null) banner =  `https://singlecolorimage.com/get/${data['banner_color'].replace('#', '')}/400x100`
                    else if(receive === null) return this.send_error(message, 1, `The user you provided doesnt have a banner`)
                    const isAuthor = member.id === message.author.id;
                    const embed = new EmbedBuilder()
                         .setTitle(isAuthor ? '> Your banner' : `> ${member.user.username}'s banner`)
                        .setURL(banner)
                        .setImage(banner)
                        .setColor(config.color)
                    message.channel.send({ embeds: [embed] })

                })
            })
        })
    }

}