// processhandler.js
// managing Maiia's processes

var console = require('./console.js');

module.exports = {
    init: () => {
        let EventEmitter = require('events')
        let core = require('../core.js');
        core.set("processhandler", new EventEmitter);
        let processhandler = core.get("processhandler");
        processhandler.on("exit", (code) => {

            let discord = core.get("discord.active");
            if (discord) {
                console.discord("Shutting down...")
                core.get("discord.bot").destroy().then(() => {
                    console.discord("Closed.");
                    discord = false;
                });
            }

            var shutdownInterval = setInterval(() => {
                if (!discord) {
                    console.maiia('Every subprocess have been stopped.')
                    process.exit(code);
                }
            }, 500);
        });
    }
}