const { fetch } = require('undici'), qs = require('qs')
const config = require('../../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
        name: 'urban',
        description : 'Search for definitions on Urban Dictionary',
        parameters : [ 'query' ],
        usage : '(query)',
        example : 'Amiri',
        aliases : [ 'urbandictionary', 'ud' ],
        module : 'Miscellaneous',

    async execute (message, args) {
        try {

            const query = qs.stringify({
                term : args.join(' ')
            })

            const definitions = await fetch(`https://api.urbandictionary.com/v0/define?${query}`, {
                method : 'GET'
            }).then((response) => response.json()).catch((error) => {
                return ctx.warn(`Bad response (\`${error.response.status}\`) from the **API**`)
            })

            if (!definitions.list.length) {
                return ctx.warn(`Couldn't find any definitions for **${args.join(' ')}**`)
            }
            message.channel.sendTyping()
            const embeds = await Promise.all(
                definitions.list.map((definition) => {
                    const match = (text) => {
                        return text.replace(/\[(.+?)\]/g, (match, p1) => {
                            return `[${p1}](http://urbandictionary.com/define.php?${qs.stringify({ term : p1 })})`
                        })
                    }
    
                    definition.definition = match(definition.definition)
                    definition.example = match(definition.example)

                    return new EmbedBuilder({
                        author : {
                            name : message.member.displayName,
                            iconURL : message.member.displayAvatarURL({
                                dynamic : true
                            })
                        },
                        title : definition.word,
                        url : definition.permalink,
                        description : definition.definition,
                        fields : [
                            {
                                name : 'Example',
                                value : definition.example
                            }
                        ],
                        footer : {
                            context : `👍  ${parseInt(definition.thumbs_up).toLocaleString()} 👎  ${parseInt(definition.thumbs_down).toLocaleString()} - ${definition.author.length ? definition.author : 'N/A'}`
                        }
                    }).setColor(config.color)
                })
            )

            await new paginatorInstance(
                message, {
                    embeds : embeds,
                    text : `{context} ∙ Page {page} of {pages}`
                }
            ).construct()
        } catch (error) {
            ctx.error()
        }
    }
}