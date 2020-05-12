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
    let i = 1
    let list = 'No more songs\n'
    if(serverQueue.songs.length != 1){
        list = serverQueue.songs.slice(1).map((m) => {
            if (i > 16) return
            i++;
            return `[${i}] - 🎵 ${m.title}  / 👤 by: ${m.author}`
        }).join('\n')
    }
    let hr = "---------------------------------------------"
    let playName = `${hr}\n🔊 Now: ${serverQueue.songs[0].title}\n👤 By: ${serverQueue.songs[0].author}\n${hr}`
    let countSong = `\n${hr}\n📒 Queue ${serverQueue.songs.length}/15 songs.`
    message.delete()
    musicchannel.send('```xl\n[SONGS QUEUE]\n' + playName + '\n\n' + list + '\n' + countSong + '\n```')

}