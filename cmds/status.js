const Discord = require('discord.js');
const store = require('./../store.js');
const settings = require('./../settings.json');

module.exports = {
  run: (bot, message, args) => {
    return new Promise((resolve, reject) => {
      store.get('config', 'config')
        .then(data => {
          bot.generateInvite(['ADMINISTRATOR'])
            .then((link) => {
              const config = data.data();
              let embed = new Discord.RichEmbed()
                .setAuthor(bot.user.username)
                .setDescription(`Estou on-line desde ${config.readyOn}`)
                .addField('Link de convite', link)
                .setColor(settings.colors.default);
              message.channel.send(embed);
              resolve();
            })
        })
        .catch(err => reject(err));
    });
  },
  help: {
    name: 'status'
  }
}
