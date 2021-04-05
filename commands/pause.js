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
    serverQueue.connection.dispatcher.pause();
    message.delete();
    musicchannel.send('🛑 ' + _('Paused song.',lang));
}