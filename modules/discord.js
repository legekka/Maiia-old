// discord.js
// discord client for Maiia

var Discord = require('discord.js');
var req = require('./req.js');
var fs = require('fs');
var console = require('./console.js');
var c = require('chalk');

module.exports = {
    init: () => {
        let core = require('../core.js').get();
        core.discord.bot = new Discord.Client();
        let bot = core.discord.bot;
        let channels = JSON.parse(fs.readFileSync('./data/discord.json').toString()).channels;
        core.discord.channels = channels;
        core.discord.channels.current = channels.main;
        bot.login(core.discord.token);
        bot.on('ready', () => {
            if (!core.discord.active) {
                core.discord.active = true;
                console.discord('Online');
                bot.channels.get(channels.main).send("Online!");
            }
        });
        bot.on('message', (message) => {
            req("./dcommand.js")(message);
        });
        bot.on('disconnected', () => {
            console.discord('Disconnected.');
        });
    }
}