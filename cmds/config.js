const Discord = require('discord.js');
const store = require('./../store.js');
const settings = require('./../settings.json');

module.exports = {
  run: (bot, message, args) => {
    return new Promise((resolve, reject) => {

      let arg = (typeof args[0] === 'undefined') ? '' : args[0];
      if (arg === '') {
        reject(new Error('Argumento inválido'));
        return;
      }
      switch (arg) {
        case 'encontros':
          let embed = new Discord.RichEmbed()
            .setAuthor(bot.user.username)
            .setDescription(`Configurando encontros com Pokémon`)
            .addField('Como configurar:', 'Entre com o nome do canal e os atalhos para o mesmo separados por vírgula.\nCertifique-se que o nome do canal está correto e sem o \'#\'.')
            .addField('Exemplo:', 'spawns-geral geral, cg | spawns-parque parque, pdc')
            .setColor(settings.colors.default);
          message.channel.send(embed)
            .then(() => {
              const filter = m => message.author.id === m.author.id;
              message.channel.awaitMessages(filter, { time: 60000, maxMatches: 1, errors: ['time'] })
                .then(messages => {
                  let params = messages.first().content.split(' ');
                  let channelName = (typeof params[0] === 'undefined') ? '' : params[0];
                  let shortcuts = (typeof params[1] === 'undefined') ? [] : params[1].split(',');
                  let channel = bot.channels.find(c => c.name === channelName);
                  if (!channel) {
                    message.channel.send('Não encontrei o referido canal.');
                    resolve();
                    return;
                  }
                  store.set('encounters', channelName, {
                      "channel": {
                        "id": channel.id,
                        "name": channelName
                      },
                      "shortcuts": shortcuts
                    })
                    .then(() => {
                      let embedOk = new Discord.RichEmbed()
                        .setAuthor(bot.user.username)
                        .setDescription(`Canal configurado! Os avisos de encontros serão enviados para ${channelName}`)
                        .addField('Como enviar?', 'Para enviar um aviso de encontro, entre com algum desses comandos:')
                        .addField('Exemplo', `!encontro ${channelName} pikachu`)
                        .addField('Exemplo', `!encontro ${channelName} 25`)
                        .setColor(settings.colors.success);
                      shortcuts.forEach(s => {
                        embedOk.addField('Exemplo', `!encontro ${s} pikachu`);
                      });
                      message.channel.send(embedOk);
                    })
                    .catch(err => console.error(err));
                  resolve();
                  return;
                })
                .catch((err) => {
                  console.error(err);
                  message.channel.send('Não pude configurar os encontros.')
                  reject();
                  return;
                });
            })
          break;
        default:
          let help = new Discord.RichEmbed()
            .setAuthor(bot.user.username)
            .setDescription(`Não entendi esse comando. Tente um dos comandos abaixo:`)
            .addField('Configurar encontros:', '!configurar encontros')
          message.channel.send(help)
          resolve();
          return;
          break;
      }

    });
  },
  help: {
    name: 'configurar'
  }
}
