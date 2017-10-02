// log.js
// logging some discord messages

var console = require('./console.js');
var c = require('chalk');


module.exports = (message, isAcommand) => {
    let chname;
    !message.channel.id ? chname = "#private#" : chname = '#' + message.channel.name + '@' + message.channel.guild.name;
    message.content != '' ? msg = message.content : msg = '<attachment>';
    if (chname == "#private#") {
        console.discord(`${c.green(chname)} ${userColor(message.author.username)}: ${c.grey(msg)}`);
    } else {
        if (require('../core.js').get("discord.channels.current") == message.channel.id) {
            console.discord(`${c.yellow(chname)} ${userColor(message.author.username)}: ${c.grey(msg)}`);
        } else if (isAcommand) {
            console.discord(c.grey(`${chname} ${message.author.username}: ${msg}`));
        }
    }

}

function userColor(username) {
    switch (username) {
        case 'Nesze': return c.bgYellow.magenta(username);
            break;
        case 'legekka': return c.bgWhite.blue(username);
            break;
        case 'gekky': return c.bgWhite.green(username);
            break;
        case 'Maiia': return c.bgWhite.magenta(username);
            break;
        default:
            /*if (is_a_friend(user.id)) {
                return c.green(user.username);
            } else {
                return c.cyan(user.username);
            }*/
            return c.cyan(user.username);
            break;
    }
}