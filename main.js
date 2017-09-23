// main.js
// main program of Maiia

var console = require('./modules/console.js');
var core = require('./core.js');
core.initialize();

core.set("discord.teszt", "tesztszöveg");
console.log(core.get());
process.exit(2);