const Discord = require('discord.js');
const client = new Discord.Client();


client.login("NjUyMTg1MzU1MjgxMjM1OTY4.XemB_w.hfPX3MqJue3Zny_fZRgruCASW4A").then(() => {
    console.log("I am ready");
    var guild = client.guilds.get('455274725476794368');
    if(guild && guild.channels.get('455274725476794370')){
        guild.channels.get('455274725476794370').send("I will sing, sing a new song\ I will sing, sing a new song.").then(() => client.destroy());
    } else {
        console.log("nope");
        //if the bot doesn't have guild with the id guildid
        // or if the guild doesn't have the channel with id channelid
    }
    client.destroy();
});