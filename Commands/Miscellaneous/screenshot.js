const { chromium } = require('playwright');
const urlModule = require('url');
const config = require('../../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "screenshot",
  aliases: ["ss"],
  description: 'Takes a screenshot of a website',
  usage: '(website) <delay in seconds>',
  example: 'https://bland.world 5',
  category: 'Miscellaneous',
  parameters: ['`website`', '`delay` (optional)'],
  permissions: ['SendMessages'],
  execute(message, args) {
    let url = args[0];
    let delaySeconds = 0;
  
    if (args.length > 1) {
      delaySeconds = parseInt(args[1]);
  
      if (isNaN(delaySeconds) || delaySeconds < 0 || delaySeconds > 60) {
        ctx.embed(`Invalid delay value. Please provide a valid delay in seconds (0-60).`);
        return;
      }
    }
  
    if (!url) {
      return;
    }
  
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }
  
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  
    if (!urlPattern.test(url)) {
      ctx.embed(`The URL you provided is not valid!`);
      return;
    }

    (async () => {
      const browser = await chromium.launch();
      message.channel.sendTyping();
      const page = await browser.newPage();

      try {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto(url);

        if (delaySeconds > 0) {
          await page.waitForTimeout(delaySeconds * 1000);
        }

        const parsedUrl = urlModule.parse(url);
        const websiteName = parsedUrl.hostname;

        const buffer = await page.screenshot();

        message.channel.send({ files: [{ attachment: buffer, name: 'screenshot.png' }] });
      } catch (error) {
        console.error(error);
        ctx.error();
      } finally {
        await browser.close();
      }
    })();
  }
};
