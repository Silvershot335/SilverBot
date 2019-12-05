const Discord = require("discord.io");
const SilverBot = new Discord.Client({
  token: 'NjUyMTg1MzU1MjgxMjM1OTY4.XellfA.5qmhYA2YQUzS7ZPsANGfTCQqefQ',
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
    console.log(channelID);
  }
  if (message === "magcord") {
    SilverBot.sendMessage({
      to: channelID,
      message: "https://discord.gg/TAsqJer"
    });
    console.log(channelID);
  }
 /* if (message === "Who is Magdalena Bay?") {
    SilverBot.sendMessage({
      to: channelID,
      message:
        "Magdalena Bay is a pop duo comprised of Mica Tenenbaum (songwriting and vocals) and Matthew Lewin (songwriting, vocals and production). The duo has been writing together since high school and started making pop as Magdalena Bay in 2016. Inspiration is drawn from retro pop songwriting and contemporary production-- the result has been a collection of upbeat and synth-driven singles."
    });
    console.log(channelID);
  }
  /*if (message === "lying whore") {
    SilverBot.sendMessage({
      to: channelID,
      message: "judy"
    });
    console.log(channelID);
  }*/
});


SilverBot.on("message", (user, userID, channelID, message, event) => { message = message.toLowerCase() 
  if (message.includes("poecs") || message.includes("poe cheat sheet")) {
    SilverBot.sendMessage({
      to: channelID,
      message: `https://silvershot335.github.io/PoECheatSheet/`
    });
  }
  if (message.includes("who is magdalena bay") || message.includes("who is magbay")) {
      SilverBot.sendMessage({
          to: channelID,
          message: `Magdalena Bay is a pop duo comprised of Mica Tenenbaum (songwriting and vocals) and Matthew Lewin (songwriting, vocals and production). The duo has been writing together since high school and started making pop as Magdalena Bay in 2016. Inspiration is drawn from retro pop songwriting and contemporary production-- the result has been a collection of upbeat and synth-driven singles.`
      })
  }
  if (message.includes("vu")||(message.includes("Vu"))) {
      SilverBot.sendMessage({
          to: channelID,
          message: `We do not speak it's name.`
      })
  }
});
