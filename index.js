const Discord = require('discord.js');
const admin = require('firebase-admin');

const serviceAccount = require('./pokegear-bot-bdf71f5e9e3f.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const bot = new Discord.Client();
const token = process.env.DISCORD_TOKEN;

bot.on('ready', () => {
  console.log(`Pokégear está pronta. Loggado como ${bot.user.tag}`);
  db.collection('config').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
});

bot.on('message', (message) => {
  // Estou falando comigo mesmo?
  if (message.author.bot) return;

  // Será que vem um comando por ai? (Comandos começam com `!`)
  if (message.content.startsWith('!ping')) {
    let args = message.content.substring(1).split(' ');
    let command = args[0];
    let text = (typeof args[1] === 'undefined') ? 'no-text' : args[1];

    switch (command) {
      case 'ping':
        message.channel.send('Pong! ' + text)
        break;
      default:

    }
  }
});

bot.login(token);
