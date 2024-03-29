// dcommand.js
// discord commands handler

module.exports = (message) => {
    if (message.channel.type != "text")
        return;
    let req = require('./req.js');
    let core = require('../core.js').get();
    let dsettings = core.discord.dsettings;
    let cmdpref = dsettings.getCmdpref(message.guild.id);
    let tsun = dsettings.getTsun(message.guild.id);
    let lower = message.content.toLowerCase();

    let commandModule = req('./command.js');
    let isAcommand = false;
    let cmd = lower.split(' ')[0].substr(cmdpref.length).replace(':', '_');

    if (core.osuirc.active && message.channel.id == core.discord.channels.osuirc && message.author.id == core.discord.ownerID) {
        if (lower.startsWith(cmdpref + 'to')) {
            commandModule.ircto.run(message);
        } else {
            commandModule.ircsay.run(message);
        }
    } else if (message.content.startsWith(cmdpref)) {
        let command = commandModule[cmd];
        if (command) {
            if (dsettings.level(message.author.id, message.guild.id) >= command.level) {
                command.run(message);
                isAcommand = true;
            }
            else {
                message.channel.send('Nincs megfelelő jogosultságod.');
                /*reqreload('./talk.js').wrongcommand(message);*/
            }
        } else {
            message.channel.send('Nincs ilyen parancs..');
        } /*else if (message.author.id != core.discord.creatorID) {
            reqreload('./talk.js').wrongcommand(message);
        }*/
    }
    return isAcommand;
}