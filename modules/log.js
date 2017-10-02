// log.js
// logging some discord messages

var console = require('./console.js');
var c = require('chalk');


module.exports =
    (message, isAcommand) => {
        let chname;
        !message.channel.id ? chname = "#private#" : chname = '#' + message.channel.name + '@' + message.channel.guild.name;
        message.content != '' ? msg = message.content : msg = '<attachment>';
        if (chname == "#private#") {
            console.discord(`${chname} ${message.author.username}: ${c.grey(msg)}`);
        } else {
            if (require('../core.js').get("discord.channels.current") == message.channel.id) {
                console.discord(`${c.yellow(chname)} ${c.cyan(message.author.username)}: ${c.grey(msg)}`);
            } else if (isAcommand) {
                console.discord(c.grey(`${chname} ${message.author.username}: ${msg}`));
            }
        }

    }
