const { queue } = require('../index')

exports.run = async (client, message, args) => {
    const serverQueue = queue.get(message.guild.id)

    const channelid = message.channel.id
    const musicchannel = client.channels.cache.get(process.env.MUSIC_CHANNEL)
    
    if(channelid !== musicchannel.id) return
    if (!message.member.voice.channel) {
        message.delete()
        return musicchannel.send('🧠 You must join a voice channel to pause.')
    }
    if (!serverQueue) {
        message.delete()
        return musicchannel.send('😭 ¡No music!, empty queue.')
    }
    serverQueue.connection.dispatcher.pause()
    message.delete()
    musicchannel.send('🛑 Paused song.')
}