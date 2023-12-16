module.exports = {
    name: 'autoplay',
    permissions: ['SendMessages'],
    category: 'Music',
    send: false,
    async execute(message, args, client) {
      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send(`There is nothing in the queue right now!`)
      const autoplay = queue.toggleAutoplay()
      ctx.approve(`AutoPlay: \`${autoplay ? 'On' : 'Off'}\``)
    }
  }