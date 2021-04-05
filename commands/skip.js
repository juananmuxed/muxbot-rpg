const { queue } = require('../index');
const { _ } = require('./../utils/utils');

exports.run = async (client, message, args, lang) => {
    const serverQueue = queue.get(message.guild.id),
        channelid = message.channel.id,
        musicchannel = client.channels.cache.get(process.env.MUSIC_CHANNEL),
        voiceChannel = client.channels.cache.get(process.env.RADIO_CHANNEL);
    
    if(channelid !== musicchannel.id) return;
    if (!message.member.voice.channel) {
        message.delete();
        return musicchannel.send('🧠 ' + _('You must join a voice channel',lang));
    }
    if (!serverQueue) {
        message.delete();
        return musicchannel.send('😭 ' + _('¡No music!, empty queue.',lang));
    }
    if (serverQueue.songs.length === 1) {
        voiceChannel.leave();
        message.delete();
        return musicchannel.send('😘 ' + _('Last song. List of songs stoped.',lang));
    }
    message.delete()
    serverQueue.connection.dispatcher.end()
    musicchannel.send(`${_('Playing',lang)}: 📣 **${serverQueue.songs[1].title}**`)

}