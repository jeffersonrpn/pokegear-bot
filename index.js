const Discord = require('discord.js');
const store = require('./store.js');

const bot = new Discord.Client();
const prefix = '!'
const color = '#3107a6'
const token = process.env.DISCORD_TOKEN;

bot.on('ready', () => {
  store.set('config', 'config', { readyOn: new Date().toString() })
    .then(() => {
      console.log(`Pokégear está pronta. Loggado como ${bot.user.tag}`);
    })
    .catch((err) => {
      console.error('Algo errado com o Firestore: ', err);
    });
});

bot.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();
  const text = args.toString();

  switch (command) {
    case 'status':
      store.get('config', 'config').then(data => {
        const config = data.data();
        let embed = new Discord.RichEmbed()
          .setAuthor(bot.user.username)
          .setDescription(`Estou on-line desde ${config.readyOn}`)
          .setColor(color);
        message.channel.send(embed);
        return;
      })
      .catch(err => {
        console.log(err);
      });
      break;
    case 'configurar':
      const arg = (typeof args[0] === 'undefined') ? 'no-args' : args[0];
      switch (arg) {
        case 'encontros':
          let embed = new Discord.RichEmbed()
            .setAuthor(bot.user.username)
            .setDescription(`Configurando encontros com Pokémon.\n\nQual canal devo mandar os alertas de encontro?\nCertifique-se que o nome do canal está correto e sem o '#'.`)
            .setColor(color);
          message.channel.send(embed)
            .then(() => {
              const filter = m => message.author.id === m.author.id;
              message.channel.awaitMessages(filter, { time: 60000, maxMatches: 1, errors: ['time'] })
                .then(messages => {
                  let channel = messages.first().content;
                  bot.channels.find("name", channel)
                    .then(() => {
                      message.channel.send(`Ok. Os avisos de spanws serão enviados para ${messages.first().content}`);
                    })
                    .catch(err => {
                      message.channel.send(`Canal ${channel} não encontrado.`);
                    })
              })
              .catch(() => message.channel.send('Cansei de esperar.') );
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
