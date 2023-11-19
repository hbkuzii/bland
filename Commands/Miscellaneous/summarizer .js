const puppeteer = require('puppeteer');
const { MessageEmbed } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'ytsummarize',
  aliases: ['yt-summarize'],
  description: 'Summarize a YouTube video',
  permissions: ['SendMessages'],
  usage: "(video URL)",
  example: "yt-summarize https://www.youtube.com/watch?v=nKWnDCaiVJo",
  category: "miscellaneous",
  execute(message, args) {
    const url = args[0];
    summarizeYouTubeVideo(message, url);
  },
};

async function summarizeYouTubeVideo(message, url) {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });

  const page = await browser.newPage();

  try {
    message.channel.sendTyping();
    await page.goto('https://www.summarize.tech/');
    await page.waitForSelector('input.me-auto.form-control[placeholder="URL of a YouTube video"]');
    await page.type('input.me-auto.form-control[placeholder="URL of a YouTube video"]', url);
    await page.keyboard.press('Enter');
    await page.waitForSelector('section');

    const paragraph = await page.$('section > p:first-of-type');

    if (paragraph) {
      const text = await page.evaluate(paragraph => paragraph.textContent, paragraph);

      const embed = new EmbedBuilder()
        .setColor(config.color)
        .addFields(
          { name: '\n', value: `>>> ${text.replace('YouTube video', `[YouTube video](${url})`)}`, inline: true }
        );
        
      message.reply({ embeds: [embed] });
    } else {
      ctx.warn('Unable to find the summary of this YouTube video.');
    }
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while summarizing the YouTube video.');
  } finally {
    await browser.close();
  }
}
