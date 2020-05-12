const { queue } = require('../index')

exports.run = async (client, message, args) => {
    const serverQueue = queue.get(message.guild.id)

    const channelid = message.channel.id
    const musicchannel = client.channels.cache.get(process.env.MUSIC_CHANNEL)
    const voiceChannel = client.channels.cache.get(process.env.RADIO_CHANNEL)
    
    if(channelid !== musicchannel.id) return
    if (!message.member.voice.channel) {
        message.delete()
        return musicchannel.send('🧠 Debes unirte a un canal de voz.')
    }
    if (!serverQueue) {
        message.delete()
        return musicchannel.send('😭 ¡No hay canción que saltar!, la cola esta vacía')
    } 
    if (serverQueue.songs.length === 1) {
        voiceChannel.leave()
        message.delete()
        return musicchannel.send('😘 Última canción. Lista de canciones parada.')
    }
    message.delete()
    serverQueue.connection.dispatcher.end()
    musicchannel.send(`Reproduciendo ahora: 📣 **${serverQueue.songs[1].title}**`)

}