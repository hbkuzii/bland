
module.exports = {
  name: 'nowplaying',
  aliases: ['np'],
  category: 'Music',
  description: "Pause the currently playing song.",
  permissions: ['SendMessages'],
  async execute(message, client) {
    const queue = client.distube.getQueue(message)
    if (!queue) return ctx.warn(`There is nothing in the queue right now!`)
    const song = queue.songs[0]
    ctx.embed(`I'm playing **\`${song.name}\`**, by ${song.user}`)
  }
}