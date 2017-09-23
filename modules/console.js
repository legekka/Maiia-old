// console.js
// console logging module

var c = require('chalk');

module.exports = {
    log: (text) => {
        console.log(text);
        return;
    },
    frame: (text, ws) => {
        if (ws) {
            console.log(`[${time("time")}] [${c.red("Frame")}] [${c.cyan("WS")}]: ${text}`)
        } else {
            console.log(`[${time("time")}] [${c.red("Frame")}]: ${text}`)
        }
        return;
    },
    maiia: (text) => {
        console.log(`[${time("time")}] [${c.magenta("Maiia")}]: ${text}`)
        return;
    },
    discord: (text) => {
        console.log(`[${time("time")}] [${c.gray("Discord")}]: ${text}`)
        return;
    },
    debug: (text) => {
        console.log(`[${time("time")}] [${c.yellow("DEBUG")}]: ${text}`);
        return;
    },
    time: (format) => {
        return time(format);
    }
}

function time(format) {
    let date = new Date();
    switch (format) {
        case "time": return `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}`
        case "date": return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" + date.getMonth() : date.getMonth()}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`
        default: return `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()} ${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" + date.getMonth() : date.getMonth()}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`
    }
}