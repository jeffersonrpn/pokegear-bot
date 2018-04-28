const Discord = require('discord.js');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const bot = new Discord.Client();
const prefix = '!'
const token = process.env.DISCORD_TOKEN;

bot.on('ready', () => {
  db.collection("config").doc("config").set({
    readyOn: new Date().toString()
  })
  .then(function() {
    console.log(`Pokégear está pronta. Loggado como ${bot.user.tag}`);
  })
  .catch(function(error) {
    console.error('Algo errado com o Firestore: ', error);
  });
});

bot.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  console.log('Recebi um comando.');

  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();
  const text = args.toString();

  switch (command) {
    case 'configurar':
      const arg = (typeof args[0] === 'undefined') ? 'no-args' : args[0];
      console.log(`${prefix}config ${args}`);
      switch (arg) {
        case 'spawns':
          message.channel.send('Configurando spawns.\nQual canal devo mandar os spawns?')
            .then(() => {
              const filter = m => message.author.id === m.author.id;
              message.channel.awaitMessages(filter, { time: 60000, maxMatches: 1, errors: ['time'] })
                .then(messages => {
                  message.channel.send(`Ok. Os avisos de spanws serão enviados para ${messages.first().content}`);
              })
              .catch(() => message.channel.send('You did not enter any input!') );
            })
          break;
        default:
          message.reply('Não entendi esse comando');
          break;
      }
      break;
    case 'ping':
      bot.channels.get('438178439678132226').send(`${message.author} enviou ${args}`)
      break;
    default:

  }

});

bot.login(token);
