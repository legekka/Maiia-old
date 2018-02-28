// blink.js
// active processes on Boltzmann VM

/*  TODO:
    - Interval a csekkolásra
    - lista kielemzése
    - üzenetküldés discordon
*/


var http = require('http');
var WebSocketServer = require('websocket').server;
var c = require('chalk');
var fs = require('fs');
var console = require('./console.js');
var exec = require('child_process').exec;
var core = require('../core.js').get();
var connection;

module.exports = {
    init: () => {
        core.blink.botlist = JSON.parse(fs.readFileSync('./data/botlist.json').toString());

        var port = 63009;
        var server = http.createServer(function (request, response) {
            response.writeHead(404);
            response.end();
        });

        server.listen(port, function () {
            console.blink(`WS listening on port: ${port}`);
        });

        wsServer = new WebSocketServer({
            httpServer: server,
            autoAcceptConnections: false
        });

        wsServer.on('request', function (request) {
            if (!originIsAllowed(request.origin)) {
                request.reject();
                console.blink('Error: Invalid WS key. Connection rejected.');
                return;
            }
            connection = request.accept('echo-protocol', request.origin);
            console.blink('WS Connection accepted.');
            core.blink.interval = setInterval(() => { sendRequest(connection) }, 10000);
            connection.sendUTF("request");
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    checkBots(JSON.parse(message.utf8Data));
                }
            });

            connection.on('close', function (reasonCode, description) {
                console.blink(`WS client disconnected from ${connection.remoteAddress}`);
                connection = undefined;
                clearInterval(core.blink.interval);
            });
        });
    },
    startbot: (bot, callback) => {
        var i = 0;
        let botlist = core.blink.botlist;
        while (i < botlist.length && botlist[i].bot.toLowerCase() != bot.toLowerCase()) { i++ }
        if (i >= botlist.length) {
            return callback(`Bot called "${bot}" wasn't found.`);
        } else {
            console.debug(botlist[i].status);
            if (botlist[i].status == "not running") {
                exec(`D: && cd ${botlist[i].path} && start ${botlist[i].path + "/" + botlist[i].exe}`);
                return callback(`${bot} was succesfully started.`);
            } else {
                return callback(`${bot} is already running.`);
            }
        }
    }
}


function originIsAllowed(origin) {
    if (origin === "BoltzmannLink") {
        return true;
    } else {
        return false;
    }
}

function sendRequest(connection) {
    connection.sendUTF("request");
}

function checkBots(msg) {
    let botlist = core.blink.botlist;
    for (k = 0; k < botlist.length; k++) {
        var i = 0;
        while (i < msg.length && msg[i].Name != botlist[k].bot && msg[i].MainWindowTitle != botlist[k].bot) { i++ }
        if (i >= msg.length) {
            if (botlist[k].status == "" || botlist[k].status == "running") {
                core.discord.bot.channels.get(core.discord.channels.botdev).send(`<@${botlist[k].owner}>, ${botlist[k].bot} is not running. use ${"`"}!startbot ${botlist[k].bot}${"`"} to restart` );
                /*core.discord.bot.fetchUser(botlist[k].owner).then(user => {
                    user.send(`${botlist[k].bot} is not running.`);
                });*/
                console.blink(`${botlist[k].bot}: ${c.red("not running")}`);
            }
            botlist[k].status = "not running";
        } else {
            botlist[k].status = "running";
        }
    };
} 