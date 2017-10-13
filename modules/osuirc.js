// osuirc.js
// discord integration of osu! irc

var irc = require('irc');
var console = require('./console.js');
var c = require("chalk");

module.exports = {
    init: () => {
        var core = require("../core.js").get();
        core.osuirc.userlist_interval = setInterval(() => { getUserlist("#hungarian") }, 10000);

        core.osuirc.client = new irc.Client('irc.ppy.sh', core.osuirc.username, {
            password: core.osuirc.password,
            channels: core.osuirc.channels
        });

        core.osuirc.client.addListener('registered', (message) => {
            core.osuirc.channel = core.osuirc.username;
            core.osuirc.active = true;
            if (message.rawCommand == '001') {
                console.irc('Connected');
                core.discord.bot.channels.get(core.discord.channels.osuirc).send('**IRC Connected**');
            }
        });

        core.osuirc.client.addListener('message', (from, to, message) => {
            if (to[0] == '#') {
                var msg = timeStamp() + ' ' + to + ' ' + from + ': ' + message;
                if (to == '#osu') {
                    msg = c.grey(msg);
                }
                if (message.indexOf('gekka') >= 0 && from != 'legekka') {
                    core.discord.bot.channels.get(core.discord.channels.osuirc).send(`<@${core.discord.ownerID}>`).then((message) => {
                        message.delete();
                    });
                }
                console.irc(msg);
                core.discord.bot.channels.get(core.discord.channels.osuirc).send('`' + timeStamp() + '` `' + to + '` `' + from + ':` ' + message);
            }
        });

        core.osuirc.client.addListener('pm', (from, text, message) => {
            console.irc(c.cyan(from) + ': ' + text);
            if (core.discord.bot.users.get(core.discord.ownerID).presence.status != 'online' || (
                core.discord.bot.users.get(core.discord.ownerID).presence.status == 'online' &&
                core.discord.bot.users.get(core.discord.ownerID).presence.game != 'osu!')) {
                core.discord.bot.channels.get(core.discord.channels.osuirc).send(`<@${core.discord.ownerID}>`).then((message) => {
                    message.delete();
                });
            }
            if (core.discord.bot.users.get(core.discord.ownerID).presence.status == 'offline' && core.osuirc.channel != core.osuirc.username) {
                core.osuirc.client.say(from, afkMessage());
                console.irc("[AFK Message]");
                core.discord.bot.channels.get(core.discord.channels.osuirc).send('`' + timeStamp() + '` `PM ' + from + '` `Maiia:` [AFK Message]');
            }
            core.discord.bot.channels.get(core.discord.channels.osuirc).send('`' + timeStamp() + '` `' + from + ':` ' + text);
        });

        core.osuirc.client.addListener('action', (from, to, text, message) => {
            if (to != core.osuirc.username) {
                console.irc(to + ' ' + from + ' ' + text);
                core.discord.bot.channels.get(core.discord.channels.osuirc).send('`' + timeStamp() + '` `' + to + '` `' + from + '` *' + text + '*');
            } else {
                console.irc('PM' + c.cyan(from) + ' ' + text);
                if (core.discord.bot.users.get(core.discord.ownerID).presence.status != 'online' || (
                    core.discord.bot.users.get(core.discord.ownerID).presence.status == 'online' &&
                    core.discord.bot.users.get(core.discord.ownerID).presence.game != 'osu!')) {
                    core.discord.bot.channels.get(core.discord.channels.osuirc).send(`<@${core.discord.ownerID}>`).then((message) => {
                        message.delete();
                    });
                }
                if (core.discord.bot.users.get(core.discord.ownerID).presence.status == 'offline' && core.osuirc.channel != core.osuirc.username) {
                    core.osuirc.client.say(from, afkMessage());
                    console.irc("[AFK Message]");
                    core.discord.bot.channels.get(core.discord.channels.osuirc).send('`' + timeStamp() + '` `PM ' + from + '` `Maiia:` [AFK Message]');
                }
                core.discord.bot.channels.get(core.discord.channels.osuirc).send('`' + timeStamp() + '` `PM ' + from + '` *' + text + '*');
            }
        })
    },
    stop: (message, callback) => {
        var core = require("../core.js").get();
        if (core.osuirc.active) {
            clearInterval(core.osuirc.userlist_interval);
            core.osuirc.client.disconnect();
            core.osuirc.active = false;
            if (core.discord.active) {
                console.irc("Disconnected")
                core.discord.bot.channels.get(core.discord.channels.osuirc).send('**IRC Disconnected**');
                core.discord.bot.channels.get(core.discord.channels.osuirc_userlist).bulkDelete(5).then(() => {
                    core.discord.bot.channels.get(core.discord.channels.osuirc_userlist).send("-- Disconnected --").then(() => {
                        return callback();
                    });
                });
            } else {
                return callback();
            }
        }
    },
    say: (text) => {
        var core = require("../core.js").get();
        core.osuirc.client.say(core.osuirc.channel, text);
        var msg = "";
        var msg2 = "";
        if (core.osuirc.channel[0] == '#') {
            msg = core.osuirc.channel + c.magenta(' legekka: ') + text;
            msg2 = '`' + timeStamp() + '` `' + core.osuirc.channel + '` `legekka:` ' + text;
        } else {
            msg = 'PM ' + core.osuirc.channel + c.magenta(' legekka: ') + text;
            msg2 = '`' + timeStamp() + '` `PM ' + core.osuirc.channel + '` `legekka:` ' + text;
        }
        console.irc(msg.toString());
        core.discord.bot.channels.get(core.discord.channels.osuirc).send(msg2.toString());
        return core.osuirc.client;
    },

}

function afkMessage() {
    return "H-hi~~! I am Maiia. Sorry but legekka is currently offline. Maybe I can help in the future, but currently I can't. He told me, if someone asks about his skin, just ignore it... Anyways I notified him.";
}

function getUserlist(channel) {
    var core = require("../core.js").get();
    if (core.osuirc.active) {
        var nicks = core.osuirc.client.chans[channel].users;
        var str = JSON.stringify(nicks);
        while (str.indexOf('"') >= 0) {
            str = str.replace('"', '');
        }
        while (str.indexOf("'") >= 0) {
            str = str.replace("'", '');
        }
        while (str.indexOf(':') >= 0) {
            str = str.replace(':', '');
        }
        str = str.replace('{', '');
        str = str.replace('}', '');
        userlist = str.split(',').sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        var str = '';
        for (i in userlist) {
            str += userlist[i] + '\n';
        }
        core.discord.bot.channels.get(core.discord.channels.osuirc_userlist).bulkDelete(5).then(()=>{
            core.discord.bot.channels.get(core.discord.channels.osuirc_userlist).send('Online: ' + (userlist.length - 1) + '\nChannel: `' + core.osuirc.channel + '`\n```' + str + '```');    
        });
        core.discord.bot.channels.get(core.discord.channels.osuirc).setTopic("Current channel: " + core.osuirc.channel);
        core.discord.bot.channels.get(core.discord.channels.osuirc_userlist).setTopic("Current channel: " + core.osuirc.channel);
    }

}

function timeStamp() {
    var da = new Date();
    var h = da.getHours();
    var m = da.getMinutes();
    var s = da.getSeconds();
    if (h < 10) { h = '0' + h }
    if (m < 10) { m = '0' + m }
    if (s < 10) { s = '0' + s }
    return h + ':' + m + ':' + s;
}