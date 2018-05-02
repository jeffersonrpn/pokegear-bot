const Discord = require('discord.js');
const request = require('request');

const store = require('./../store.js');
const settings = require('./../settings.json');

module.exports = {
  run: (bot, message, args) => {
    return new Promise((resolve, reject) => {
      console.log(args);
      if (args.length < 3) {
        let embed = new Discord.RichEmbed()
          .setAuthor(bot.user.username)
          .setDescription(`Preciso de 3 parâmetros. O nome ou atalho do canal, o nome ou número do pokémon e uma dica de onde ele está.`)
          .addField('Comando', `!encontro <canal ou atalho> <pokemon> <onde encontrá-lo>`)
          .setColor(settings.colors.error);
        message.channel.send(embed);
        resolve();
        return;
      }
      let channelNameOrShortcut = args[0];
      let idOrName = args[1].toLowerCase().trim();
      let location = args.slice(2, args.length+1);

      // store.find('encounters', channelNameOrShortcut)

      let embed = new Discord.RichEmbed()
        .setDescription(`Um Pokémon selvagem foi avistado por ${message.author.username}!`)
        .addField('Espécie', " " + idOrName)
        .addField('Localidade', " " + location)
        .setColor(settings.colors.default);
      message.channel.send(embed);
      // let sent = message.

      // request(settings.api + 'pokemon/' + idOrName + '/', { json: true }, (err, res) => {
      //   if (err) { reject(err) }
      //   console.log(res.name);
      //   console.log(res.sprites);
      // });

    });
  },
  help: {
    name: 'encontro'
  }
}
