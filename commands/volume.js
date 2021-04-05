const { queue } = require('../index');
const { _ } = require('./../utils/utils');

exports.run = async (client, message, args) => {
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
    let countVolumen = parseInt(args[0])
    if (!args.join(' ') || countVolumen < 100) {
        let dispatcher = serverQueue.connection.dispatcher
        await dispatcher.setVolume(Math.min((dispatcher.volume = countVolumen / 50)))
        message.delete()
        return musicchannel.send(`🔊 **${_('Volume',lang)}: \`${Math.round(dispatcher.volume * 50)}\`%**`)
    }
    else {
        message.delete()
        return musicchannel.send('💉 ' + _('Add a value between 1 and 100',lang))
    }

}