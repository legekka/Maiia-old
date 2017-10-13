// main.js
// main program of Maiia

var console = require('./modules/console.js');
var c = require('chalk');
console.maiia('Initializing core...');
require('./core.js').init();
console.maiia('Loading modules...');
var core = require('./core.js').get();

console.maiia(`[${c.green("  OK  ")}] Processhandler`);
require('./modules/processhandler.js').init();
console.maiia(`[${c.green("  OK  ")}] JSconsole`);
require('./modules/jsconsole.js').init();
if (core.autorun.discord) {
    console.maiia(`[${c.green("  OK  ")}] Discord`);
    require("./modules/discord.js").init(); 
} else {
    console.maiia(`[${c.grey("  --  ")}] Discord`);
}
if (core.autorun.cachemanager) {
    console.maiia(`[${c.green("  OK  ")}] CacheManager`);
    require("./modules/cachemanager.js").init();
} else {
    console.maiia(`[${c.grey("  --  ")}] CacheManager`);
}
if (core.autorun.memwatch) {
    console.maiia(`[${c.green("  OK  ")}] MemWatch`);
    require("./modules/memwatch.js").init();
} else {
    console.maiia(`[${c.grey("  --  ")}] MemWatch`);
}
if (core.autorun.osuirc) {
    console.maiia(`[${c.green("  OK  ")}] osu!irc`);
    require("./modules/osuirc.js").init();
} else {
    console.maiia(`[${c.grey("  --  ")}] osu!irc`);
}