const Discord = require('discord.js');

const bot = new Discord.Client();
const token = process.env.DISCORD_TOKEN;

bot.on('ready', () => {
  console.log(`Pokégear está pronta. Loggado como ${bot.user.tag}`);
});

bot.on('message', (message) => {
  // Estou falando comigo mesmo?
  if (message.author.bot) return;

  // Será que vem um comando por ai? (Comandos começam com `!`)
  if (message.content.substring(1) === '!') {
    let args = message.content.substring(1).split(' ');
    let command = args[0];
    let text = (typeof args[1] === 'undefined') ? 'no-text' : args[1];

    switch (command) {
      case 'ping':
        message.reply('Pong! ' + text)
        break;
      default:

    }
  }
});

bot.login(token);
