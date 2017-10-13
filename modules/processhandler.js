// processhandler.js
// managing Maiia's processes

var console = require('./console.js');

module.exports = {
    init: () => {
        let EventEmitter = require('events')
        let core = require('../core.js').get();
        core.processhandler = new EventEmitter;
        let processhandler = core.processhandler;
        processhandler.on("exit", (code) => {

            let discord = core.discord.active;
            let osuirc = core.osuirc.active;

            if (discord) {
                console.discord("Shutting down...")
                if (osuirc) {
                    require('./osuirc.js').stop(undefined, () => {
                        osuirc = false;
                        core.discord.bot.destroy().then(() => {
                            console.discord("Closed.");
                            discord = false;
                        });
                    });
                } else {
                    core.discord.bot.destroy().then(() => {
                        console.discord("Closed.");
                        discord = false;
                    });
                }
            }

            let cachemanager = core.cachemanager.interval ? true : false;
            if (cachemanager) {
                clearInterval(core.cachemanager.interval);
                console.maiia('CacheManager interval cleared.');
                cachemanager = false;
            }
            var shutdownInterval = setInterval(() => {
                if (!discord && !cachemanager && !osuirc) {
                    console.maiia('Every subprocess have been stopped.')
                    process.exit(code);
                }
            }, 500);
            setTimeout(()=> {
                console.maiia("Can't close after 20 seconds, force closing...");
                process.exit(code);
            },20000);
        });
        process.on("uncaughtException", (error) => {
            console.log(error.stack);
            if (core.discord.active) {
                core.discord.bot.channels.get(core.discord.channels.error).send(`<@${core.discord.ownerID}> ${"```"}${error.stack}${"```"}`);
            } else {
                processhandler.emit("exit", 1)
            }
        });
    }
}