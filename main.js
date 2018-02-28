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
if (core.autorun.framehb) {
    console.maiia(`[${c.green("  OK  ")}] Frame-HB`);
    require("./modules/framehb.js").init();
} else {
    console.maiia(`[${c.grey("  --  ")}] Frame-HB`);
}
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
if (core.autorun.delmes) {
    console.maiia(`[${c.green("  OK  ")}] delmes`);
    require("./modules/delmes.js").init();
} else {
    console.maiia(`[${c.grey("  --  ")}] delmes`);
}
if (core.autorun.pwdmgr) {
    console.maiia(`[${c.green("  OK  ")}] Password Manager`);
    require("./modules/passwdmanager.js").init();
} else {
    console.maiia(`[${c.grey("  --  ")}] Password Manager`);
}
if (core.autorun.blink) {
    console.maiia(`[${c.green("  OK  ")}] Boltzmann Link`);
    require("./modules/blink.js").init();
} else {
    console.maiia(`[${c.grey("  --  ")}] Boltzmann Link`);
}
if (core.autorun.mlink) {
    console.maiia(`[${c.green("  OK  ")}] Maiia Link`);
    require("./modules/mlink.js").init();
    require("./modules/mlink.js").statusInit();
    if (core.autorun.discord) {
        require("./modules/mlink.js").discordStatusInit();
    }
} else {
    console.maiia(`[${c.grey("  --  ")}] Maiia Link`);
}