const Discord = require('discord.js');
const store = require('./store.js');
const fs = require('fs');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const prefix = '!'
const token = process.env.DISCORD_TOKEN;

fs.readdir('./cmds/', (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  let jsFiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsFiles.length <= 0) {
    console.error('Nenhum comando encontrado.');
    return;
  }
  jsFiles.forEach((file, i) => {
    let cmd = require(`./cmds/${file}`);
    bot.commands.set(cmd.help.name, cmd);
  })
});

bot.on('ready', () => {
  store.set('config', 'config', { readyOn: new Date().toString() })
    .then(() => {
      console.log(`Pokégear está pronta. Loggado como ${bot.user.tag}`);
      console.log(bot.commands);
      bot.generateInvite(['ADMINISTRATOR']).then((link) => console.log(link));
    })
    .catch((err) => {
      console.error('Algo errado com o Firestore: ', err);
    });
});

bot.on('message', message => {
  if (message.author.bot) return;

  let messageArray = message.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if (!command.startsWith(prefix)) return;

  let cmd = bot.commands.get(command.slice(prefix.length));
  if (cmd) {
    cmd.run(bot, message, args)
      .then(() => {
        console.log(cmd.help.name);
        console.log(args);
      })
      .catch(err => console.error(err));
  }

});

bot.login(token);
