"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_io_1 = __importStar(require("discord.io"));
var fs_1 = __importDefault(require("fs"));
var winston_1 = __importDefault(require("winston"));
var SilverBot = new discord_io_1.default.Client({
    token: fs_1.default.readFileSync('./token.txt', 'utf8'),
    autorun: true
});
var map;
function saveCustomCommandsToFile(command, value) {
    map.set(command, value);
    var commands = [];
    map.forEach(function (value, key) {
        commands.push({ key: key, value: value });
    });
    fs_1.default.writeFileSync('./config/commands.json', JSON.stringify(commands));
}
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
    SilverBot.setPresence({
        idle_since: 'no',
        game: {
            name: 'Killshot',
            type: 2
        }
    });
    SilverBot.getMembers;
    map = new Map();
    for (var _i = 0, _a = JSON.parse(fs_1.default.readFileSync('./config/commands.json', 'utf8')); _i < _a.length; _i++) {
        var command = _a[_i];
        map.set(command.key, command.value);
    }
    console.log(discord_io_1.Member);
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
    var actualCase = message;
    message = message.toLowerCase();
    var link = getLinkFromMessage(message);
    if (link) {
        SilverBot.sendMessage({
            to: channelID,
            message: link
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
        var command = actualCase.substring(SilverBot.id.length + '<@> '.length);
        var commandArray_1 = command.split(' ').filter(function (item) { return item.trim() !== ''; });
        if (commandArray_1[0] === 'aesthetic') {
            SilverBot.sendMessage({
                to: channelID,
                message: commandArray_1
                    .filter(function (i) { return i !== commandArray_1[0]; })
                    .join('')
                    .split('')
                    .map(function (item) { return item + ' '; })
                    .join('')
            });
        }
        if (commandArray_1[0] === 'store') {
            var value = commandArray_1
                .filter(function (item) { return item !== commandArray_1[0] && item !== commandArray_1[1]; })
                .join(' ');
            saveCustomCommandsToFile(commandArray_1[1], value);
            SilverBot.sendMessage({
                to: channelID,
                message: "Stored command " + commandArray_1[1] + " -- value: " + value
            });
        }
        if (commandArray_1[0] === 'commands') {
            var commands_1 = '';
            map.forEach(function (value, key) {
                commands_1 += key + " -> " + value + "\n";
            });
            SilverBot.sendMessage({
                to: channelID,
                message: commands_1
            });
        }
        if (map.has(commandArray_1[0])) {
            SilverBot.sendMessage({
                to: channelID,
                message: "" + map.get(commandArray_1[0])
            });
        }
    }
    var serverID = '648728910657486848';
    var venice = '651264806082576395';
    var judy = '167804931439329280';
    var man = '177116185006047232';
    if (message.includes("<@" + judy + ">, you just advanced to level 5!")) {
        SilverBot.sendMessage({
            to: channelID,
            message: 'Working'
        });
    }
    if (message.includes(", you just advanced to level 5!")) {
        SilverBot.addToRole({
            serverID: serverID,
            role: venice,
            userID: judy
        });
    }
});
