// ytdlmp3.js
// discord module for youtube mp3 downloading



module.exports = {
    dlmp3: (url, message) => {
        var core = require('../core.js');
        var ytdl = require('ytdl-core');
        var fs = require('fs');
        var cws = fs.createWriteStream("./cache/" + message.id + ".mp3");
        cws.on("close", () => {
            message.channel.send({files: ["./cache/" + message.id + ".mp3"]})
        })
        try {
            ytdl(url, { filter: "audioonly" })
                .pipe(cws);
        }
        catch (error) {
            message.channel.send('Ajjaj. ' + error.message);
        }


    }
}