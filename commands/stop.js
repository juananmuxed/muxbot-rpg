const { queue } = require('../index')

exports.run = async (client, message, args) => {
    const serverQueue = queue.get(message.guild.id)

    const channelid = message.channel.id
    const musicchannel = client.channels.cache.get(process.env.MUSIC_CHANNEL)
    const voiceChannel = client.channels.cache.get(process.env.RADIO_CHANNEL)
    
    if(channelid !== musicchannel.id) return
    if (!message.member.voice.channel) {
        message.delete()
        return musicchannel.send('🧠 You must join a voice channel to stop songs.')
    }
    if (!serverQueue) {
        message.delete()
        return musicchannel.send('😭 ¡No music!, empty queue.')
    } 
    serverQueue.songs = []
    serverQueue.connection.dispatcher.end()
    voiceChannel.leave()
    message.delete()
    musicchannel.send('👌 You screwed up the party...')

}