"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_io_1 = __importDefault(require("discord.io"));
var fs_1 = __importDefault(require("fs"));
var SilverBot = new discord_io_1.default.Client({
    token: fs_1.default.readFileSync('./token.txt', 'utf8'),
    autorun: true
});
var winston_1 = __importDefault(require("winston"));
var logger = winston_1.default.createLogger({
    level: 'debug',
    format: winston_1.default.format.colorize(),
    transports: [
        new winston_1.default.transports.Console({ format: winston_1.default.format.simple() })
    ]
});
SilverBot.on('ready', function () {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(SilverBot.username + " ~~ (" + SilverBot.id + ")");
});
SilverBot.on('disconnect', function (errMsg, code) {
    logger.error('Bot disconnected');
    logger.error("message: " + errMsg + " - error code: " + code);
    SilverBot.connect();
});
function getLinkFromMessage(message) {
    if (message === 'magcord') {
        return 'https://discord.gg/TAsqJer';
    }
    if (message === 'r/magdalenabay') {
        return 'https://reddit.com/r/MagdalenaBay';
    }
    if (message.includes('progressive prog')) {
        return 'https://www.reddit.com/r/ProgressiveProg/';
    }
    if (message.includes('poecs') || message.includes('poe cheat sheet')) {
        return 'https://silvershot335.github.io/PoECheatSheet/';
    }
    return null;
}
SilverBot.on('message', function (user, userID, channelID, message, event) {
    message = message.toLowerCase();
    var link = getLinkFromMessage(message);
    if (link) {
        SilverBot.sendMessage({
            to: channelID,
            message: message
        });
    }
    if (message === 'fuck you') {
        SilverBot.sendMessage({
            to: channelID,
            message: 'you dumb motherfucker'
        });
    }
    if (message.includes('who is magdalena bay') ||
        message.includes('who is magbay')) {
        SilverBot.sendMessage({
            to: channelID,
            message: 'Magdalena Bay is a pop duo comprised of Mica Tenenbaum (songwriting and vocals) and Matthew Lewin (songwriting, vocals and production). The duo has been writing together since high school and started making pop as Magdalena Bay in 2016. Inspiration is drawn from retro pop songwriting and contemporary production-- the result has been a collection of upbeat and synth-driven singles.'
        });
    }
    if (message.includes('vu')) {
        SilverBot.sendMessage({
            to: channelID,
            message: "We do not speak it's name."
        });
    }
    if (message.indexOf("<@" + SilverBot.id + ">") === 0) {
        var command = message.substring(SilverBot.id.length + '<@> '.length);
        if (command.includes('aesthetic')) {
            var wordToPrint = command.substring('aethetic '.length);
            SilverBot.sendMessage({
                to: channelID,
                message: wordToPrint
                    .split('')
                    .map(function (item) { return item + ' '; })
                    .join('')
            });
        }
    }
});
