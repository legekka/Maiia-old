// help.js
// getting command list

const fs = require('fs');
var core = require('../core.js').get();
var path = './modules/command.js';

module.exports = {
    list: (message, commands, callback) => {
        var entrylist = [];
        text = fs.readFileSync(path).toString().split('\n');
        for (i in text) {
            if (!text[i].startsWith('//')) {
                if (text[i].indexOf('help: "') >= 0){
                    let index = text[i].indexOf('help: "');
                    let command = text[i].split('|')[0].substr(index + 8);
                    let cmd = commands[command];
                    if (!cmd)
                        continue;
                    let desc = text[i].split('|')[1];
                    if (!desc)
                        continue;
                    desc = desc.substr(0, desc.lastIndexOf('"'));
                    if (core.discord.dsettings.level(message.author.id, message.guild.id) >= cmd.level){
                        entrylist.push({
                            'cmd': command,
                            'desc': desc
                        });
                    }
                }
            }
        }
        return callback(entrylist);
    }
}