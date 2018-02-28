// mlink.js
// Maiia network system


var WebSocketServer = require('websocket').server;
var http = require('http');
var c = require('chalk');
var fs = require('fs');
var core = require('../core.js').get();
var console = require('./console.js');
core.mlink.connections = [];

core.mlink.clients = [];

module.exports = {
    init: () => {
        var port = 63336;
        var server = http.createServer(function (request, response) {
            response.writeHead(404);
            response.end();
        });

        server.listen(port, function () {
            console.mlink(`WS listening on port: ${port}`);
        });

        wsServer = new WebSocketServer({
            httpServer: server,
            autoAcceptConnections: false
        });

        wsServer.on('request', function (request) {
            if (!originIsAllowed(request.origin)) {
                request.reject();
                console.mlink('Error: Invalid WS key. Connection rejected.');
                return;
            }
            var connection = request.accept('echo-protocol', request.origin);
            console.mlink('WS Connection accepted.');
            connection.id = core.mlink.connections.length;

            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    if (message.utf8Data == "pong") {
                        connection.pingEnd = parseDate(new Date());
                        if (core.mlink.clients[connection.clientid]) {
                            core.mlink.clients[connection.clientid].ping = connection.pingEnd - connection.pingStart;
                        }
                    } else {
                        var msg = JSON.parse(message.utf8Data);
                        if (msg.type == "initial") {
                            connection.clientid = msg.id;
                            core.mlink.connections[connection.id].clientid = msg.id;
                            if (!core.mlink.clients[msg.id]) {
                                core.mlink.clients[msg.id] = msg;
                            } else {
                                core.mlink.clients[msg.id].type = msg.type;
                                core.mlink.clients[msg.id].id = msg.id;
                                core.mlink.clients[msg.id].pcName = msg.pcName;
                                // TODO v
                                if (msg.userName) core.mlink.clients[msg.id].userName = msg.userName;
                                else core.mlink.clients[msg.id].userName = "Outdated Client";

                                core.mlink.clients[msg.id].ip = msg.ip;
                                core.mlink.clients[msg.id].localip = msg.localip;
                                core.mlink.clients[msg.id].proclist = msg.proclist;
                            }
                            core.mlink.clients[msg.id].online = msg.online;

                        }
                    }
                }
            });

            connection.on('close', function (reasonCode, description) {
                console.mlink(`WS client disconnected from ${connection.remoteAddress}`);
                if (connection.clientid) {
                    core.mlink.clients[connection.clientid].proclist = [];
                    core.mlink.clients[connection.clientid].online = false;
                }
                core.mlink.connections[connection.id] = undefined;
                connection = undefined;
            });
            core.mlink.connections.push(connection);
        });
    },
    statusInit: () => {
        core.mlink.statusInterval = setInterval(() => {
            core.mlink.connections.forEach(connection => {
                if (connection) {
                    connection.pingStart = parseDate(new Date());
                    connection.sendUTF("ping");
                    setTimeout(() => { connection.sendUTF("requestInitialUpdate") }, core.mlink.pingOffset);
                }
            });
        }, core.mlink.statusIntervalTime);
    },
    discordStatusInit: () => {
        // TODO: memory leak teszt a var-okra
        core.mlink.discordStatusInterval = setInterval(() => {
            var messagestring = "";
            for (var client in core.mlink.clients) {
                if (core.mlink.clients[client].online) {
                    messagestring += `[Online] | ${core.mlink.clients[client].userName}@${core.mlink.clients[client].pcName}\n*(${core.mlink.clients[client].ip} / ${core.mlink.clients[client].localip})*\nProcesses: ${core.mlink.clients[client].proclist.length} | Ping: ${core.mlink.clients[client].ping} ms\n\n`;

                } else {
                    messagestring += `[Offline] | ${core.mlink.clients[client].pcName}\n\n`;
                }
            }
            //let embedMsg = messagestring;
            let embedMsg = {
                embed: {
                    "title": "MaiiaLink Status",
                    "description": messagestring
                }
            };
            if (core.discord.bot.channels.get(core.discord.channels.mlinkstatus).lastMessageID) {
                core.discord.bot.channels.get(core.discord.channels.mlinkstatus).fetchMessage(core.discord.bot.channels.get(core.discord.channels.mlinkstatus).lastMessageID).then(msg => {
                    msg.edit(embedMsg)
                }).catch((result) => {
                    core.discord.bot.channels.get(core.discord.channels.mlinkstatus).send(embedMsg);
                });
            } else {
                core.discord.bot.channels.get(core.discord.channels.mlinkstatus).send(embedMsg);
            }
        }, core.mlink.discordStatusIntervalTime);
    }
}

function originIsAllowed(origin) {
    return (origin == core.mlink.password)
}

function parseDate(date) {
    return date.getMilliseconds() + date.getSeconds() * 1000 + date.getMinutes() * 60000 + date.getHours() * 3600000 + date.getDate() * 86400000;
}