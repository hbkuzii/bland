module.exports = {
    name: 'rewind',
    description: "Seek rewind in the queue.",
    permissions: ['SendMessages'],
    category: 'Music',
    send: false,
    async execute(message, args, client) {
      const queue = client.distube.getQueue(message)
      if (!queue) return ctx.warn(`There is nothing in the queue right now!`)
      if (!args[0]) {
        return ctx.warn(` Please provide time (in seconds) to go rewind!`)
      }
      const time = Number(args[0])
      if (isNaN(time)) return ctx.warn(`Please enter a valid number!`)
      queue.seek((queue.currentTime - time))
     ctx.approve(`Rewinded the song for ${time}!`)
    }
  }