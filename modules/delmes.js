// delmes.js
// delayed message module

var fs = require('fs');
var core = require('../core.js').get();
var bot = core.discord.bot;
var timers = [];
var messages = [];
module.exports = {
    init: () => {
        messages = JSON.parse(fs.readFileSync('./data/delmes.json').toString());
        messages.forEach((element, index) => {
            date = new Date();
            let delay = Math.round(element.date - (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()));
            if (delay < 0) {
                delay = 0;
                messages.splice(index, 1);
            } else {
                delay = delay * 1000;
                timers.push(setTimeout(() => {
                    bot.fetchUser(element.from).then(userFrom => {
                        bot.fetchUser(element.to).then(userTo => {
                            userTo.send(`Yo! This is a timed message from ${userFrom.username}:\n` + "```" + element.message + "```");
                        });
                    });
                }, delay));
            }
        });
        fs.writeFileSync('./data/delmes.json', JSON.stringify(messages));
    },
    add: (from, to, message, date, type) => {
        var message = {
            from: from,
            to: to,
            message: message,
            date: date,
            type: type
        }
        let dateNow = new Date();
        let delay = Math.round(message.date - (dateNow.getHours() * 3600 + dateNow.getMinutes() * 60 + dateNow.getSeconds()));  
        if (delay < 0) {
            delay = 0;
            message = undefined;
            return false;
        } else {
            delay = delay * 1000;
            timers.push(setTimeout(() => {
                bot.fetchUser(message.from).then(userFrom => {
                    bot.fetchUser(message.to).then(userTo => {
                        userTo.send(`Yo! This is a timed message from ${userFrom.username}:\n` + "```" + message.message + "```");
                    });
                });
            }, delay));
        }
        if (message != undefined) {
            messages.push(message);
        }
        fs.writeFileSync('./data/delmes.json', JSON.stringify(messages));
        return true;
    },
    remove: (from, to, date) => {
        var i = 0;
        while (i < messages.length && messages[i].from != from && messages[i].date != date && messages[i].date != date) {
            i++;
        }
        if (i < messages.length) {
            messages.splice(i, 1);
            timers[i].clearTimeout();
            return true;
        } else {
            return false;
        }
    }
}

