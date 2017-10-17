// command.js
// commands

var req = require('./req.js');
var console = require('./console.js');
var core = require('../core.js').get();

module.exports = {
    help: {
        level: 0,
        help: "!help|Leírás Maiia parancsaihoz.",
        run: (message) => {
            req('./help.js').list(message, module.exports, (list) => {
                var str = '';
                for (i in list) {
                    str += '`!' + list[i].cmd + '` - *' + list[i].desc + '*\n';
                }
                while (str.replace('!', core.discord.dsettings.getCmdpref(message.guild.id)) != str) {
                    str = str.replace('!', core.discord.dsettings.getCmdpref(message.guild.id));
                }
                message.channel.send({
                    embed: {
                        'title': 'Parancsok',
                        'description': str
                    }
                })
            });
        }
    },
    checkcache: {
        level: 1,
        help: "!checkcache|Cache mappa mérete.",
        run: (message) => {
            req('./cachemanager.js').check(message);
        }
    },
    delcache: {
        level: 1,
        help: "!delcache|Cache mappa tartalmának ürítése.",
        run: (message) => {
            req('./cachemanager.js').del(message)
        }
    },
    stats: {
        level: 1,
        help: "!stats|Maiia állapota.",
        run: (message) => {
            require('./memwatch.js').stats(message);
        }
    },
    ytdlmp3: {
        level: 0,
        help: "!ytdlmp3|Youtube video mp3 letöltő. !ytdlmp3 <url>",
        run: (message) => {
            require('./ytdlmp3.js').dlmp3(message.content.split(' ')[1], message);
        }
    },
    close: {
        level: 2,
        help: "!close|Maiia leállítása.",
        run: (message) => {
            message.channel.send("Leállítás...");
            core.processhandler.emit("exit", 2);
        }
    },
    reload: {
        level: 1,
        help: "!reload|Maiia újraindítása.",
        run: (message) => {
            message.channel.send("Újraindítás...");
            core.processhandler.emit("exit", 3);
        }
    },
    motd: {
        level: 2,
        help: "!motd|'playing <game>' megváltoztatására. !motd <szó>",
        run: (message) => {
            motd = message.content.substr(message.content.split(' ')[0].length + 1);
            require('../core.js').get().discord.bot.user.setGame(motd);
        }

    },
    addadmin: {
        level: 1,
        help: "!addadmin|Admin hozzáadása Maiiához.",
        run: (message) => {

            let hls = message.mentions.members;
            if (hls.size == 0) {
                message.channel.send("Érvénytelen highlight.");
            }
            else {
                let names = [];
                hls.forEach((value, key, map) => {
                    core.discord.dsettings.addAdmin(message.guild.id, key);
                    names.push(value.displayName);
                });
                req('./command.js').admins.run(message);
            }
        }
    },
    remadmin: {
        level: 1,
        help: "!remadmin|Adminok eltávolitása.",
        run: (message) => {
            //let core = require('../core.js').get();
            let hls = message.mentions.members;
            if (hls.size == 0) {
                message.channel.send("Érvénytelen highlight.");
            }
            else {
                let names = [];
                hls.forEach((value, key, map) => {
                    core.discord.dsettings.removeAdmin(message.guild.id, key);
                    names.push(value.displayName);
                });
                req('./command.js').admins.run(message);
            }
        }
    },
    admins: {
        level: 0,
        help: "!admins|Jelenlegi adminjai Maiiának a szerveren.",
        run: (message) => {
            //let core = require('../core.js').get();
            var admins = core.discord.dsettings.admins(message.guild.id).map((v, i, a) => message.guild.members.get(v).displayName);
            if (admins.length == 0) {
                message.channel.send('Jelenleg nincsenek adminjaim.');
            } else {
                message.channel.send(`Adminjaim: \`${admins.join('`, `')}\` `);
            }
        }
    },
    ircto: {
        level: 2,
        help: "!to|osu!irc címzett váltása.",
        run: (message) => {
            message.delete();
            core.osuirc.channel = message.content.substr(core.discord.dsettings.getCmdpref(message.guild.id).length + 3);
            message.channel.send('[IRC] Címzett: `' + core.osuirc.channel + '`');
            core.discord.bot.channels.get(core.discord.channels.osuirc).setTopic("Current channel: " + core.osuirc.channel);
        }
    },
    ircsay: {
        level: 2,
        help: "ircsay|osu!irc discord channelben automata üzenetküldés",
        run: (message) => {
            message.delete();
            var text = message.content;
            require('./osuirc.js').say(text);
        }
    }
}