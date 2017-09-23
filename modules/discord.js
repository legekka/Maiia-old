// discord.js
// discord client for Maiia

var Discord = require('discord.js');
var req = require('./req.js');
var fs = require('fs');
var console = require('./console.js');
var c = require('chalk');

module.exports = {
    init: () => {
        let core = require('../core.js');
        core.set("discord.bot", new Discord.Client());
        let bot = core.get('discord.bot');
        let channels = JSON.parse(fs.readFileSync('./data/discord.json').toString()).channels;
        console.log(channels);
        core.set("discord.channels", channels);
        core.set("discord.channels.current", channels.main);
        bot.login(core.get('discord.token'));
        bot.on('ready', () => {
            if (!core.get("discord.active")) {
                core.set("discord.active", true);
                console.discord('Online');
                bot.channels.get(channels.main).send("Online!");
            }
        });
        bot.on('message', (message) => {
            if (message.content == "!ping") {
                message.channel.send("Pong.");
            } else if (message.content == "!close") {
                core.get("processhandler").emit("exit", 2);
            } else if (message.content == "!reload") {
                core.get("processhandler").emit("exit", 3);
            }
        });
    }
}