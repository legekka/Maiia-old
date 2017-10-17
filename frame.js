// Framework
// Maiia's immortal frame

var fs = require('fs');
var exec = require('child_process').exec;
var c = require('chalk');
var http = require('http');
var WebSocketServer = require('websocket').server;
var req = require('./modules/req.js');
var console = require('./modules/console.js');
var EventEmitter = require('events');

var maiia = new EventEmitter();                     // maiia's events
var childproc;                                      // childprocess
var inp = process.openStdin();                      // console input to control Maiia through the Frame
inp.addListener('data', (data) => inpdata(data))
var port = 40400;                                   // WebSocket port
var connection;                                     // WebSocket connection

maiia.on('start', () => {
    if (childproc) {
        log('Error: Maiia is running.')
        return;
    }
    childproc = exec('node ./main.js --color --no-warnings');     // starting childprocess
    childproc.stdout.on('data', (data) => maiia.emit('data', data)); // initializing events
    //childproc.stderr.on('data', (error) => maiia.emit('error', error));
    childproc.on('close', (code) => maiia.emit('exit', code))
});

maiia.on('data', (data) => {
    console.log(data.substr(0, data.length - 1));
    if (connection) {
        connection.sendUTF(data.substr(0, data.length - 1))
    }
});

/*maiia.on('error', (error) => {
    log(`Error in Maiia: ${error}`);
});
*/
maiia.on('exit', (code) => {
    switch (code) {
        // 2: stopping
        case 2: {
            log('Maiia has been stopped.');
            childproc = undefined;
            return;
        }
        // 3: reloading
        case 3: {
            log('Reloading Maiia...');
            childproc = undefined;
            maiia.emit('start');
            return;
        }
        // 1: error
        case 1: {
            log('Fatal error. Reloading Maiia...');
            childproc = undefined;
            maiia.emit('start');
            return;
        }
        default: {
            log(`Error code: ${code}`);
            inpdata("close");
            childproc = undefined;
            maiia.emit('start');
            return;
        }
    }
});

function inpdata(data) {
    var cmd = data.toString().toLowerCase().trim();
    if (!cmd.startsWith('!')) {
        // direct channel for Maiia
        if (childproc) {
            childproc.stdin.write(data);
        } else {
            log('Error: Maiia is not running.');
        }
    } else {
        // frame commands
        if (cmd == '!start') {
            maiia.emit('start');
        } else if (cmd == '!reload-frame') {
            if (childproc) {
                log('Closing Maiia...')
                log('Reloading frame in 5 seconds...');
                setTimeout(() => {
                    process.exit(1);
                }, 5000);
            } else {
                log('Reloading frame...');
                process.exit(1);
            }
        } else if (cmd == '!close-frame') {
            if (childproc) {
                log('Closing Maiia...');
                log('Closing frame in 5 seconds...');
                childproc.stdin.write('close');
                setTimeout(() => {
                    process.exit(2);
                }, 5000);
            } else {
                log('Closing frame...');
                process.exit(2);
            }
        } else {
            log('Error: Command not found.');
        }
    }
}

function log(text, ws) {
    console.frame(text, ws);
    if (connection) {
        connection.sendUTF(text);
    }
}

var server = http.createServer(function (request, response) {
    response.writeHead(404);
    response.end();
});

server.listen(port, function () {
    log(`WS listening on port: ${port}`);
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        log('Error: Invalid WS key. Connection rejected.');
        return;
    }
    connection = request.accept('echo-protocol', request.origin);
    WSconnected = true;
    log('WS Connection accepted.');
    connection.sendUTF("You're connected to Maiia's Frame.\nHave fun!");

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            log(message.utf8Data.toString().trim(), true);
            inpdata(message.utf8Data);
        }
    });

    connection.on('close', function (reasonCode, description) {
        log(`WS client disconnected from ${connection.remoteAddress}`);
        connection = undefined;
    });
});

function originIsAllowed(origin) {
    let key = JSON.parse(fs.readFileSync('./init.json').toString());
    if (origin === key.frame.key) {
        return true;
    } else {
        return false;
    }
}

maiia.emit('start');