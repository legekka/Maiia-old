// cachemanager.js
// advanced cache manager

var fs = require('fs');
var getSize = require('get-folder-size');
var core = require('../core.js').get();
var console = require('./console.js');
var path = './cache/';
var exec = require('child_process').exec;

module.exports = {
    init: () => {
        core.cachemanager.interval = setInterval(() => { manageSize(core.cachemanager.limit) }, 1800000);
    },
    check: (message) => {
        checkSize(core.cachemanager.limit, (size) => {
            if (message) {
                message.channel.send('Cache folder size: ' + size + '/' + core.cachemanager.limit + ' Mb')
            }
        })
    },
    del: (message) => {
        if (message) {
            message.channel.send('Clearing...');
        }
        delCache(message);
    }
}

function delCache(message) {
    console.maiia('Clearing cache...');
    let proc = exec('del /F /Q .\\cache\\*');
    proc.on('exit', () => {
        if (message) {
            message.channel.send('Cache deleted.');
        }
        console.maiia('Cache deleted.');
    })
}

function checkSize(limit, callback) {
    getSize(path, (err, size) => {
        if (err) { throw err; }
        var mb = size / 1024 / 1024;
        var mbtext = mb.toFixed(2);
        console.maiia('Cache folder size: ' + mbtext + '/' + limit + ' Mb');
        return callback(mbtext);
    });
}

function manageSize(limit) {
    getSize(path, (err, size) => {
        if (err) { throw err; }
        var mb = size / 1024 / 1024;
        var mbtext = mb.toFixed(2);
        console.maiia('Cache folder size: ' + mbtext + '/' + limit + ' Mb');
        if (mb > limit) {
            delCache();
        }
    });
}