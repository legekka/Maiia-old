// main.js
// main program of Maiia

var console = require('./modules/console.js');
var core = require('./core.js');
var c = require('chalk');
console.maiia('Initializing core...');
core.init();
console.maiia('Loading modules...');

console.maiia(`[${c.green("Processhandler")}]`);
require('./modules/processhandler.js').init();
console.maiia(`[${c.green("Jsconsole")}]`);
require('./modules/jsconsole.js').init();
if (core.get("autorun.discord")) {
    console.maiia(`[${c.green("Discord")}]`);
    require("./modules/discord.js").init();
} else {
    console.maiia(`[${c.red("Discord")}]`);
}