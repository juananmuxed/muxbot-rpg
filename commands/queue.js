const { queue } = require('../index');
const { _ } = require('./../utils/utils');

exports.run = async (client, message, args, lang) => {
    const serverQueue = queue.get(message.guild.id),
        channelid = message.channel.id,
        musicchannel = client.channels.cache.get(process.env.MUSIC_CHANNEL);
    
    if(channelid !== musicchannel.id) return;
    if (!message.member.voice.channel) {
        message.delete();
        return musicchannel.send('🧠 ' + _('You must join a voice channel',lang));
    }
    if (!serverQueue) {
        message.delete();
        return musicchannel.send('😭 ' + _('¡No music!, empty queue.',lang));
    }
    let i = 1, list = _('No more songs',lang) + '\n';
    if(serverQueue.songs.length != 1){
        list = serverQueue.songs.slice(1).map((m) => {
            if (i > 16) return
            i++;
            return `[${i}] - 🎵 ${m.title}  / 👤 ${_('by',lang)}: ${m.author}`
        }).join('\n')
    }
    let hr = "---------------------------------------------",
        playName = `${hr}\n🔊 ${_('Now',lang)}: ${serverQueue.songs[0].title}\n👤 ${_('by',lang)}: ${serverQueue.songs[0].author}\n${hr}`,
        countSong = `\n${hr}\n📒 ${_('Queue',lang)} ${serverQueue.songs.length}/15 ${_('songs',lang)}.`;
    message.delete();
    musicchannel.send('```xl\n[' + _('SONGS QUEUE',lang) + ']\n' + playName + '\n\n' + list + '\n' + countSong + '\n```');

}