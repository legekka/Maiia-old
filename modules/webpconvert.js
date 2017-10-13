// webpconvert.js
// advanced image-to-webp conversion module

var fs = require('fs');
var webp = require('webp-converter');
var console = require('./console.js');
var core = require('../core.js').get();
var c = require('chalk');


const extensions = ['png', 'jpg', 'bmp'];
const path = './cache/';

function httpsGet(url, filename, callback) {
    var downloadedfile = fs.createWriteStream(filename);
    var request = require('https').get(url, function (response) {
        response.pipe(downloadedfile, { end: false });
        response.on('end', () => {
            return callback(filename);
        });
    });
}

function httpGet(url, filename, callback) {
    var downloadedfile = fs.createWriteStream(filename);
    var request = require('http').get(url, function (response) {
        response.pipe(downloadedfile, { end: false });
        response.on('end', () => {
            return callback(filename);
        });
    });
}

module.exports = {
    file: (filePath, callback) => {
        var filename = filePath.split('/')[filePath.split('/').length - 1];
        filename = filename.substr(0, filename.length - filename.split('.')[filename.split('.').length - 1].length);
        webp.cwebp(filePath, path + filename + 'webp', '-q 100', () => {
            return callback(path + filename + 'webp');
        });
    },
    createEntry: (message) => {
        var link;
        if (message.attachments.first() != undefined) {
            let url = message.attachments.first().url;
            let ext = url.split('.')[url.split('.').length - 1];
            if (extensions.indexOf(ext) >= 0)
                link = url;
        } else if (message.content.indexOf('http') >= 0) {
            var url = message.content.substr(message.content.indexOf('http')).split(' ')[0];
            var ext = url.split('.')[url.split('.').length - 1];
            if (extensions.indexOf(ext) >= 0)
                link = url;
        }
        if (link) {
            var emoji = core.discord.bot.emojis.find('name', 'hypressed');
            message.react(emoji);
        }

    },
    execEntry: (message, user) => {
        console.discord(c.gray(`webpconvert requested by ${user.username}#${user.discriminator}`));
        var link;
        var ext;
        if (message.attachments.first() != undefined) {
            let url = message.attachments.first().url;
            ext = url.split('.')[url.split('.').length - 1];
            if (extensions.indexOf(ext) >= 0)
                link = url;
        } else if (message.content.indexOf('http') >= 0) {
            var url = message.content.substr(message.content.indexOf('http')).split(' ')[0];
            ext = url.split('.')[url.split('.').length - 1];
            if (extensions.indexOf(ext) >= 0)
                link = url;
        }
        if (link) {
            var filename = require('md5')(link);
            var filepath1 = path + filename + '.' + ext;
            var filepath2 = path + filename + '.webp';
            if (link.toLowerCase().indexOf('https') >= 0) {
                httpsGet(link, filepath1, () => {
                    webp.cwebp(filepath1, filepath2, "-q 95", () => {
                            user.send({ files: [filepath2] });
                    })
                })
            } else {
                httpGet(link, filepath1, () => {
                    webp.cwebp(filepath1, filepath2, "-q 95", () => {
                            user.send({ files: [filepath2] });
                    })
                })
            }
        }
    }
}