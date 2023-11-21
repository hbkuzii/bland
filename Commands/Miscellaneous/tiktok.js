const { charToHex } = require('discord-emojis-parser')
const { fetch } = require('undici')
const config = require('../../config.json');
const { EmbedBuilder } = require('discord.js');

const commands = [
    'download', 'dl', 'videos', 'vids'
]

module.exports = {
        name: 'tiktok',
            description : 'Get information on a TikTok profile',
            parameters : [ 'username' ],
            syntax : '(username)',
            example : '@MrBeast',
            aliases : [ 'tt' ],
    async execute (message, args) {
        let username = String(args[0]).toLowerCase()

            try {
                message.channel.sendTyping()
                
                const results = await fetch(`https://www.tikwm.com/api/user/info?unique_id=${username}`, {
                    method : 'POST'
                }).then((response) => response.json())
                
                if (!results.data) {
                    return ctx.warn(`Profile [**${username}**](https://www.tiktok.com/@${username}) doesn't exist`)
                }
                
                const { user, stats } = results.data

                console.log(results.data)
                
                message.channel.send({
                    embeds : [
                        new EmbedBuilder({
                            author : {
                                name : message.member.displayName,
                                iconURL : message.member.displayAvatarURL({
                                    dynamic : true
                                })
                            },
                            title : `${user.uniqueId !== user.nickname ? `${user.nickname} (@${user.uniqueId})` : `${user.uniqueId}`} ${user.privateAccount ? ':lock:' : user.verified ? ':ballot_box_with_check:' : ''}`,
                            url : `https://www.tiktok.com/@${user.uniqueId}`,
                            description : user.signature,
                            fields : [
                                {
                                    
                                    name : 'Likes',
                                    value : stats.heartCount.toLocaleString(),
                                    inline : true
                                },
                                {
                                    name : 'Followers',
                                    value : stats.followerCount.toLocaleString(),
                                    inline : true
                                },
                                {
                                    name : 'Following',
                                    value : stats.followingCount.toLocaleString(),
                                    inline : true
                                }
                            ],
                            thumbnail : {
                                url : user.avatarLarger
                            }
                        }).setColor(config.color)
                    ]
                })
            } catch (error) {
                return ctx.error()
            }
        }
    }