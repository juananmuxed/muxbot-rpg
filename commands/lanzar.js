exports.run = (client, message, args) => {
    const rolchannel = client.channels.cache.get(process.env.ROL_CHANNEL)
    const channelid = message.channel.id

    if(channelid !== rolchannel.id) return
    
    rolchannel.send('Para lanzar dados usa el formato !dice <tirada> <modificador> donde <tirada> es "4d10" y <modificador> añade o resta a la suma "+3"').catch(console.error)
}