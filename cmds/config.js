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
          message.channel.send(`Configurando encontros com Pokémon.\n\nQual canal devo mandar os alertas de encontros?\nCertifique-se que o nome do canal está correto e sem o '#'.`)
            .then(() => {
              const filter = m => message.author.id === m.author.id;
              message.channel.awaitMessages(filter, { time: 60000, maxMatches: 1, errors: ['time'] })
                .then(messages => {
                  message.channel.send(`Ok. Os avisos de encontros serão enviados para ${messages.first().content}`);
                  resolve();
                })
                .catch(() => {
                  message.channel.send('Não pude configurar os encontros.')
                  reject();
                });
            })
          break;
        default:
          message.reply('Não entendi esse comando');
          resolve();
          break;
      }

    });
  },
  help: {
    name: 'configurar'
  }
}
