require('dotenv').config();
const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const config = require('./config/config.json');

const queue = new Map();
const client = new Discord.Client();

fs.readdir('./events/', (err, files) => {
    if (err) return console.log(err);
    
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        
        const event = require(`./events/${file}`),
            eventName = file.split('.')[0];
        
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    })
})

client.commands = new Enmap();

fs.readdir('./commands/', (err, files) => {
    if (err) return console.error(err)
    
    console.log('Attempting to load commands');
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        
        const props = require(`./commands/${file}`),
            commandName = file.split(".")[0];

        if(config.alias[commandName]) {
            config.alias[commandName].forEach(e => {
                client.commands.set(e, props);
            });
        }
        
        client.commands.set(commandName, props);
    })
})

client.login(process.env.DISCORD_TOKEN);

module.exports = { queue }