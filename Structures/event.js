const fs = require('fs');
const client = require('../bland.js')
module.exports = (client) => {
  const eventFolders = fs.readdirSync('./Events');
  
  for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(`./Events/${folder}`).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
      const event = require(`../Events/${folder}/${file}`);
      
      if (typeof event !== 'function') {
        console.error(`[${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}] Error: Event in ${folder}/${file} is not a function.`);
        continue;
      }

      client.on(file.split('.')[0], event.bind(null, client));
      console.log(`[${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}] Event loaded: ${file}`);
    }
  }
};
