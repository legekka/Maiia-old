// framehb.js
// module for checking io-connection with the frame
var console = require('./console.js');

module.exports = {
    init: () => {
        var core = require('../core.js').get();
        let EventEmitter = require('events');
        core.framehb.handler = new EventEmitter;
        core.framehb.request = false;
        core.framehb.interval = setInterval(() => {
            console.log('{HB-Ping}');
            core.framehb.request = true;
            setTimeout(()=>{
                if (core.framehb.request) {
                    process.emit("uncaughtException", new Error("Lost IO link with the Frame - Closing this lost process."));
                }
            },2000);
        }, 5000);
        core.framehb.handler.on("answer", ()=>{
            core.framehb.request = false;    
        });

    }
}