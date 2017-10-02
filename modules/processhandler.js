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
            if (discord) {
                console.discord("Shutting down...")
                core.discord.bot.destroy().then(() => {
                    console.discord("Closed.");
                    discord = false;
                });
            }

            let cachemanager = core.cachemanager.interval ? true : false;
            if (cachemanager)  {
                clearInterval(core.cachemanager.interval);
                console.maiia('CacheManager interval cleared.');
                cachemanager = false;
            }
            var shutdownInterval = setInterval(() => {
                if (!discord && !cachemanager) {
                    console.maiia('Every subprocess have been stopped.')
                    process.exit(code);
                }
            }, 500);
        });
    }
}