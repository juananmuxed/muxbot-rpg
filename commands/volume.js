const { queue } = require('../index')

exports.run = async (client, message, args) => {
    const serverQueue = queue.get(message.guild.id)

    const channelid = message.channel.id
    const musicchannel = client.channels.cache.get(process.env.MUSIC_CHANNEL)
    
    if(channelid !== musicchannel.id) return
    if (!message.member.voice.channel) {
        message.delete()
        return musicchannel.send('🧠 You must join a voice channel.')
    }
    if (!serverQueue) {
        message.delete()
        return musicchannel.send('😭 ¡No music!, empty queue.')
    }
    let countVolumen = parseInt(args[0])
    if (!args.join(' ') || countVolumen < 100) {
        let dispatcher = serverQueue.connection.dispatcher
        await dispatcher.setVolume(Math.min((dispatcher.volume = countVolumen / 50)))
        message.delete()
        return musicchannel.send(`🔊 **Volume: \`${Math.round(dispatcher.volume * 50)}\`%**`)
    }
    else {
        message.delete()
        return musicchannel.send('💉 Add a value between **1 and 100**')
    }

}