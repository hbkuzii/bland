module.exports = {
    name: 'autoplay',
    description: 'Play similar songs as the one in the queue',
    permissions: ['SendMessages'],
    category: 'Music',
    send: false,
    async execute(message, args, client) {
      const queue = client.distube.getQueue(message)
      if (!queue) return ctx.warn(`There is nothing in the queue right now!`)
      const autoplay = queue.toggleAutoplay()
      ctx.approve(`AutoPlay: \`${autoplay ? 'On' : 'Off'}\``)
    }
  }