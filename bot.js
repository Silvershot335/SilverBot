const Discord = require("discord.io");
const SilverBot = new Discord.Client({
  token: "NjUyMTg1MzU1MjgxMjM1OTY4.XelFjA.66Xpqyueg4SbQa2GxuLFDa8dVTE",
  autorun: true
});

const winston = require("winston");

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.colorize(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

SilverBot.on("ready", () => {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(`${SilverBot.username} ~~ (${SilverBot.id})`);
});

SilverBot.on("disconnect", (errMsg, code) => {
  logger.error(`Bot disconnected`);
  logger.error(`message: ${errMsg} - error code: ${code}`);
  SilverBot.connect();
});

SilverBot.on("message", (user, userID, channelID, message, event) => {
    if (message === "ping") {
        SilverBot.sendMessage({
            to: channelID,
            message: "pong"
        });
        console.log(channelID)
    }
})

SilverBot.on("message", (user, userID, channelID, message, event) => {
    if (message === "Mag") {
        SilverBot.sendMessage({
            to: channelID,
            message: "Bay"
        });
        console.log(channelID)
    }
})