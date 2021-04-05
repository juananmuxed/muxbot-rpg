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
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    voiceChannel.leave();
    message.delete();
    musicchannel.send('👌 ' + _('You screwed up the party...',lang));
}