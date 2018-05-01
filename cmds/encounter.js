const Discord = require('discord.js');
const request = require('request');

const store = require('./../store.js');
const settings = require('./../settings.json');

module.exports = {
  run: (bot, message, args) => {
    return new Promise((resolve, reject) => {

    request(settings.api + 'pokemon/1/', { json: true }, (err, res) => {
      if (err) { reject(err) }
      console.log(res);
    });

    });
  },
  help: {
    name: 'encontro'
  }
}
