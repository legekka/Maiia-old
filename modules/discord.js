// discord.js
// discord client for Maiia

var Discord = require('discord.js');
var req = require('./req.js');
var fs = require('fs');
var console = require('./console.js');
var c = require('chalk');
var core = require('../core.js').get();

module.exports = {
    init: () => {
        core.discord.bot = new Discord.Client();
        let bot = core.discord.bot;
        let channels = core.discord.channels;
        core.discord.channels.current = channels.main;
        bot.login(core.discord.token);
        bot.on('ready', () => {
            if (!core.discord.active) {
                core.discord.active = true;
                console.discord('Online');
                bot.user.setGame(core.discord.motd);
                bot.channels.get(channels.main).send("Online!");
            }
        });
        bot.on('message', (message) => {
            let isAcommand = req("./dcommand.js")(message);
            req("./webpconvert.js").createEntry(message);

            req('./log.js')(message, isAcommand);
        });
        // webpconvert
        bot.on('messageReactionAdd', (messageReaction, user) => {
            if (messageReaction.emoji == core.discord.bot.emojis.find('name', 'hypressed')) {
                if (user.id != core.discord.id) {
                    req('./webpconvert.js').execEntry(messageReaction.message, user);
                }
            }
        });
        bot.on('disconnected', () => {
            console.discord('Disconnected.');
        });
    }
}