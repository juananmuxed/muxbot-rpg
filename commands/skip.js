const { queue } = require('../index')

exports.run = async (client, message, args) => {
    const serverQueue = queue.get(message.guild.id)

    const channelid = message.channel.id
    const musicchannel = client.channels.cache.get(process.env.MUSIC_CHANNEL)
    const voiceChannel = client.channels.cache.get(process.env.RADIO_CHANNEL)
    
    if(channelid !== musicchannel.id) return
    if (!message.member.voice.channel) {
        message.delete()
        return musicchannel.send('🧠 You must join a voice channel.')
    }
    if (!serverQueue) {
        message.delete()
        return musicchannel.send('😭 ¡No song to skip!, empty queue.')
    } 
    if (serverQueue.songs.length === 1) {
        voiceChannel.leave()
        message.delete()
        return musicchannel.send('😘 Last song. List of songs stoped.')
    }
    message.delete()
    serverQueue.connection.dispatcher.end()
    musicchannel.send(`Playing now: 📣 **${serverQueue.songs[1].title}**`)

}