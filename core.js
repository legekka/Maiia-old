// core.js
// all global variables in Maiia

var fs = require('fs');
var console = require('./modules/console.js');
var core;

module.exports = {
    init: () => {
        core = JSON.parse(fs.readFileSync('./init.json').toString());
    },
    get: (property) => {
        if (property) {
            return eval("core." + property);
        } else {
            return core;
        }
    },
    set: (property, value) => {
        eval("core." + property + ' = value;')
    }
}