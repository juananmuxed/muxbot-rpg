const fs = require('fs');

module.exports = (client, message) => {
    let prefix = process.env.PREFIX;
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g),
        command = args.shift().toLowerCase();
    let cmd = client.commands.get(command),
        lang = 'en';

    if (!cmd) {
        let files = fs.readdirSync('./language/');
    
        files.forEach((file) => {
            const langFile = require(`./../language/${file}`);
            let keys = Object.keys(langFile.commands),
                values = Object.values(langFile.commands);
            values.forEach((v,i) => {
                if(v == command) {
                    cmd = client.commands.get(keys[i]);
                    lang = file.split('.')[0];
                }
            })
        })
    }

    if (!cmd) return;

    cmd.run(client, message, args, lang);
}