exports.run = (client, message, args) => {
    const rolchannel = client.channels.cache.get(process.env.ROL_CHANNEL)
    const channelid = message.channel.id

    if(channelid !== rolchannel.id) return
    
    rolchannel.send('To roll dice use the format !dice <roll> <modifier> where <roll> is "4d10" and <modifier> adds or subtracts to the sum "+3"').catch(console.error)
}