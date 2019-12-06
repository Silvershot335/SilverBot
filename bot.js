const Discord = require("discord.io");
const fs = require("fs");

const SilverBot = new Discord.Client({
  token: fs.readFileSync("./token.txt", "utf8"),
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
  logger.error("Bot disconnected");
  logger.error(`message: ${errMsg} - error code: ${code}`);
  SilverBot.connect();
});

function getLinkFromMessage(message) {
  if (message === "magcord") {
    return "https://discord.gg/TAsqJer";
  }
  if (message === "r/magdalenabay") {
    return "https://reddit.com/r/MagdalenaBay";
  }
  if (message.includes("progressive prog")) {
    return "https://www.reddit.com/r/ProgressiveProg/";
  }
  if (message.includes("poecs") || message.includes("poe cheat sheet")) {
    return "https://silvershot335.github.io/PoECheatSheet/";
  }
}
SilverBot.on("message", (user, userID, channelID, message, event) => {
  message = message.toLowerCase();
  link = getLinkFromMessage(message);
  if (link) {
    SilverBot.sendMessage({
      to: channelID,
      message
    });
  }
  if (message === "fuck you") {
    SilverBot.sendMessage({
      to: channelID,
      message: "you dumb motherfucker"
    });
  }
  if (
    message.includes("who is magdalena bay") ||
    message.includes("who is magbay")
  ) {
    SilverBot.sendMessage({
      to: channelID,
      message:
        "Magdalena Bay is a pop duo comprised of Mica Tenenbaum (songwriting and vocals) and Matthew Lewin (songwriting, vocals and production). The duo has been writing together since high school and started making pop as Magdalena Bay in 2016. Inspiration is drawn from retro pop songwriting and contemporary production-- the result has been a collection of upbeat and synth-driven singles."
    });
  }
  if (message.includes("vu")) {
    SilverBot.sendMessage({
      to: channelID,
      message: "We do not speak it's name."
    });
  }
  if (message.indexOf(`<@${SilverBot.id}>`) === 0) {
    const command = message.substring(SilverBot.id.length + "<@> ".length);
    if (command.includes("aesthetic")) {
      const wordToPrint = command.substring("aethetic ".length);
      SilverBot.sendMessage({
        to: channelID,
        message: wordToPrint
          .split("")
          .map(item => item + " ")
          .join("")
      });
    }
  }
});


