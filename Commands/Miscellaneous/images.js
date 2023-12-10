const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

api = 'ioTcbX3E1u47otskLYdHENhxWufh9D3J'; // Your wallhaven api

module.exports = {
  name: "imagegen",
  aliases: ["imgen"],
  description: 'See a hot image from wallhaven',
  usage: '<search query>',
  parameters: ['`search query`'],
  execute(message, args, client) {
    try {
      const query = args.join(" ").replace(" ", "+") || null;

      if (!query) {
        message.reply("Please provide a search query.");
        return;
      }

      if (!api) {
        message.reply("NSFW options are not available without a valid API key.");
        return;
      }

      const categoryCode = '111';
      const purityCode = '100';
      const ratios = '';
      let sortingMethod = 'random';
      const colorCode = '';
      const ai_filter = '0';

      if (sortingMethod === 'toplist') {
        sortingMethod = '&topRange=1y&sorting=toplist';
      }

      const baseUrl = api ? `https://wallhaven.cc/api/v1/search?apikey=${api}&` : `https://wallhaven.cc/api/v1/search?`;
      const apiUrl = `${baseUrl}q=${query}&categories=${categoryCode}&purity=${purityCode}&ratios=${ratios}&sorting=${sortingMethod}&colors=${colorCode}&ai_art_filter=${ai_filter}`;

      axios.get(apiUrl)
        .then(response => {
          const msg = response.data.data[0].path;
          message.reply(msg);
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 429) {
              message.reply("API rate limit reached. Please wait before making another request.");
            } else if (error.response.status === 401) {
              message.reply("Unauthorized. Please check your API key.");
            }
          } else {
            console.error("Error fetching Wallhaven API:", error.message);
            message.reply("An error occurred while fetching the image. Please try again later.");
          }
        });
    } catch (error) {
      console.error("Error executing 'image' command:", error.message);
      message.reply("An error occurred while processing the command. Please try again later.");
    }
  }
};
