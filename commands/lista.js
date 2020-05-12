const { queue } = require('../index')

exports.run = async (client, message, args) => {
    const serverQueue = queue.get(message.guild.id)

    const channelid = message.channel.id
    const musicchannel = client.channels.cache.get(process.env.MUSIC_CHANNEL)
    
    if(channelid !== musicchannel.id) return
    if (!message.member.voice.channel) {
        message.delete()
        return musicchannel.send('🧠 Debes unirte a un canal de voz.')
    }
    if (!serverQueue) {
        message.delete()
        return musicchannel.send('😭 ¡No hay música!, la cola esta vacía.')
    }
    let i = 1
    let list = 'Sin más canciones\n'
    if(serverQueue.songs.length != 1){
        list = serverQueue.songs.slice(1).map((m) => {
            if (i > 16) return
            i++;
            return `[${i}] - 🎵 ${m.title}  / 👤 por: ${m.author}`
        }).join('\n')
    }
    let hr = "---------------------------------------------"
    let playName = `${hr}\n🔊 Sonando: ${serverQueue.songs[0].title}\n👤 Por: ${serverQueue.songs[0].author}\n${hr}`
    let countSong = `\n${hr}\n📒 Lista ${serverQueue.songs.length}/15 canciones.`
    message.delete()
    musicchannel.send('```xl\n[LISTA DE CANCIONES]\n' + playName + '\n\n' + list + '\n' + countSong + '\n```')

}