// jsconsole.js
// console input for Maiia

var console = require('./console.js');
var core = require('../core.js').get();

module.exports = {
    init: () => {
        let inp = process.openStdin();
        inp.addListener('data', (data) => input(data));
    }
}

function input(data) {
    var cmd = data.toString().toLowerCase().trim();
    if (cmd == "close" || cmd == "stop") {
        core.processhandler.emit("exit", 2);
    } else if (cmd == "reload") {
        core.processhandler.emit("exit", 3);
    } else {
        console.maiia(`Error: command '${cmd}' not found.`);
    }
}