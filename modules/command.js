// command.js
// commands

var req = require('./req.js');
var console = require('./console.js');
var core = require('../core.js').get();

module.exports = {
    close: {
        level: 3,
        help: "!close|Maiia leállítása.",
        run: (message) => {
            message.channel.send("Leállítás...");
            core.processhandler.emit("exit", 2);
        }
    },
    reload: {
        level: 2,
        help: "!reload|Maiia újraindítása.",
        run: (message) => {
            message.channel.send("Újraindítás...");
            core.processhandler.emit("exit", 3);
        }
    },
    motd: {
        level: 3,
        help: "!motd|'playing <game>' megváltoztatására. !motd <szó>",
        run: (message) => {
            motd = message.content.substr(message.content.split(' ')[0].length + 1);
            require('../core.js').get().discord.bot.user.setGame(motd);
        }

    },
    addadmin: {
        level: 2,
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
        level: 2,
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
    }
}