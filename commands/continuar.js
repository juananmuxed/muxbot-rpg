const { queue } = require('../index')

exports.run = async (client, message, args) => {
    const serverQueue = queue.get(message.guild.id)

    const channelid = message.channel.id
    const musicchannel = client.channels.cache.get(process.env.MUSIC_CHANNEL)
    
    if(channelid !== musicchannel.id) return
    if (!message.member.voice.channel) {
        message.delete()
        return musicchannel.send('🧠 Debes unirte a un canal de voz para continuar.')
    }
    if (!serverQueue) {
        message.delete()
        return musicchannel.send('😭 ¡No hay música!, la cola esta vacía.')
    }
    serverQueue.connection.dispatcher.resume()
    message.delete()
    musicchannel.send('💖 Continua la canción.')
}