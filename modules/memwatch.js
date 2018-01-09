// memwatch.js
// memory-leak watcher


var core = require('../core.js').get();
var console = require('./console.js');
var limit = core.memwatch.limit;

module.exports = {
    init: () => {
        core.memwatch.interval = setInterval(() => {
            let memrss = process.memoryUsage().rss;
            if (memrss / 1024 / 1024 > limit) {
                console.maiia('Memory overload: ' + (memrss / 1024 / 1024).toFixed(2) + ' MB / ' + limit.toFixed(2) + " MB");
                if (core.discord.active) {
                    core.discord.bot.channels.get(core.discord.channels.error).send('Memory overload: ' + (memrss / 1024 / 1024).toFixed(2) + ' MB / ' + limit.toFixed(2) + " MB");
                }
                core.processhandler.emit("exit", 1);
            }
        }, 1000);
    },
    stats: (message) => {
        var memrss = process.memoryUsage().rss;
        memrss = (memrss / 1024 / 1024).toFixed(2);
        if (message != undefined) {
            message.channel.send({
                embed:
                {
                    'title': 'Maiia-Status',
                    'description': 'Uptime: ' + format(process.uptime()) + '\nRam usage: ' + memrss + ' MB'
                }
            })
        }
    }
}

function format(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}
