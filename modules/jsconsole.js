// jsconsole.js
// console input for Maiia

var console = require('./console.js');

module.exports = {
    init: () => {
        let inp = process.openStdin();
        inp.addListener('data', (data) => input(data));
    }
}

function input(data) {
    let core = require('../core.js');
    var cmd = data.toString().toLowerCase().trim();
    if (cmd == "close" || cmd == "stop") {
        core.get("processhandler").emit("exit", 2);
    } else if (cmd == "reload") {
        core.get("processhandler").emit("exit", 3);
    } else {
        console.maiia(`Error: command '${cmd}' not found.`);
    }
}