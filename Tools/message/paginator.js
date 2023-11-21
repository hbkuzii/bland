const Discord = require('discord.js')
const config = require('../../config.json')

const proper = (c, i) => {
    if (!c.text) {
        return `Page ${i + 1} of ${c.embeds.length}${c.entries ? ` (${c.entries} ${c.entries === 1 ? 'entry' : 'entries'})` : ''}`
    } else {
        return c.text.replace('{page}', i + 1).replace('{pages}', c.embeds.length).replace('{entries}', c.entries).replace('{context}', c.footers[i] || 'N/A')
    }
}
  
module.exports = class Paginator {
    constructor (message, parameters = {}) {
        this.message = message
        this.bot = message.client
        this.author = message.author

        this.parameters = parameters
    }

    async construct () {
        const { embeds, components = [], entries, text, iconURL } = this.parameters

        this.embeds = embeds, this.components = components, this.entries = entries, this.text = text, this.iconURL = iconURL, this.footers = embeds.map((embed) => embed.data.footer?.context || null)

        await this.paginate()
    }

    async paginate () {
        const ActionRow = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder({
                emoji : '<:left:1142505171377729597>',
                customId : 'Previous'
            }).setStyle('Primary'),
            new Discord.ButtonBuilder({
                emoji : '<:right:1142505170786340944>',
                customId : 'Next'
            }).setStyle('Primary'),
            new Discord.ButtonBuilder({
                emoji : '<:goto:1142505166868848640>',
                customId : 'FastForward',
            }).setStyle('Secondary'),
            new Discord.ButtonBuilder({
                emoji : '<:delete:1142505169540628500>',
                customId : 'Cancel',
            }).setStyle('Danger')
        )

        this.embeds[0].setFooter({
            text : proper(this, 0),
            iconURL : this.iconURL ? this.iconURL : null
        })

        const message = await this.message.reply({
            embeds : [
                this.embeds[0]
            ],
            components : this.embeds.length === 1 ? this.components.length ? this.components : [] : [
                ActionRow,
                ...this.components
            ]
        })

        if (this.embeds.length === 1) return

        const filter = (interaction) => {
            if (interaction.isButton() && interaction.customId && interaction.user.id === this.author.id) {
                return true
            } else {
                return false
            }
        }

        const collector = await message.createMessageComponentCollector({
            filter, time : 60000
        })

        var index = 0,cancel = false

        collector.on('collect', async (interaction) => {
            await interaction.deferUpdate()

            if (interaction.user.id !== this.author.id) {
                return
            }

            switch (interaction.customId) {
                case ('Previous') : {
                    try {
                        index = index > 0 ? --index : this.embeds.length - 1

                        this.embeds[index].setFooter({
                            text : proper(this, index),
                            iconURL : this.iconURL ? this.iconURL : null
                        })

                        await message.edit({
                            embeds : [
                                this.embeds[index]
                            ],
                            components : [
                                ActionRow,
                                ...this.components
                            ]
                        })
                    } catch (error) {
                        console.error('Paginator Previous', error)
                    }

                    break
                }

                case ('Next') : {
                    try {
                        index = index + 1 < this.embeds.length ? ++index : 0

                        this.embeds[index].setFooter({
                            text : proper(this, index),
                            iconURL : this.iconURL ? this.iconURL : null
                        })

                        await message.edit({
                            embeds : [
                                this.embeds[index]
                            ],
                            components : [
                                ActionRow,
                                ...this.components
                            ]
                        })
                    } catch (error) {
                        console.error('Paginator Next', error)
                    }

                    break
                }

                case ('FastForward') : {
                    try {
                        for (const component of ActionRow.components.values()) {
                            component.setDisabled(true)
                        }

                        await message.edit({
                            components : [
                                ActionRow
                            ]
                        })

                        await interaction.followUp({
                            embeds : [
                                new Discord.EmbedBuilder({
                                    description : `${this.author}: Which **page** would you like to **fast forward** to?`,
                                }).setColor(config.color)
                            ],
                            ephemeral : true
                        })

                        const messageFilter = (message) => {
                            return message.author.id === this.author.id
                        }

                        const messageCollector = message.channel.createMessageCollector({
                            filter : messageFilter,
                            time : 15000,
                            max : 1
                        })

                        messageCollector.on('collect', async (collectedMessage) => {
                            if (isNaN(collectedMessage.content)) {
                                messageCollector.stop()
                                collectedMessage.delete()

                                return await interaction.followUp({
                                    embeds : [
                                        new Discord.EmbedBuilder({
                                            description : `${this.author}: Only pass a **number**.`
                                        }).setColor(config.color)
                                    ],
                                    ephemeral : true
                                })
                            } else {
                                const number = parseInt(collectedMessage.content)

                                index = number - 1

                                this.embeds[index].setFooter({
                                    text : proper(this, index),
                                    iconURL : this.iconURL ? this.iconURL : null
                                })
        
                                await message.edit({
                                    embeds : [
                                        this.embeds[index]
                                    ]
                                })

                                messageCollector.stop()
                                collectedMessage.delete()
                            }
                        })

                        messageCollector.on('end', async () => {
                            for (const component of ActionRow.components.values()) {
                                component.setDisabled(false)
                            }

                            message.edit({
                                components : [
                                    ActionRow,
                                    ...this.components
                                ]
                            })
                        })
                    } catch (error) {
                        console.error('Paginator Fast Forward', error)
                    }

                    break
                }

                case ('Cancel') : {
                    try {
                        cancel = true

                        collector.stop()
                        message.delete()
                        this.message.delete()
                    } catch (error) {
                        console.error('Paginator Cancel', error)
                    }

                    break
                }
            }
        })

        collector.on('end', async () => {
            if (cancel) return

            return await message.edit({
                components : []
            })
        })
    }
}