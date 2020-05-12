const ytdl = require('ytdl-core')
const search = require('youtube-search')
const { queue } = require('../index')

exports.run = async (client, message, args) => {
    const serverQueue = queue.get(message.guild.id)

    const channelid = message.channel.id
    const musicchannel = client.channels.cache.get(process.env.MUSIC_CHANNEL)
    const voiceChannel = client.channels.cache.get(process.env.RADIO_CHANNEL)
    
    if(channelid !== musicchannel.id) return

    const permissions = voiceChannel.permissionsFor(message.client.user)

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return musicchannel.send('¡Necesito permisos para unirme y hablar en el canal de voz!');
    }
    var opts = {
        maxResults: 1,
        key: process.env.KEY_YOUTUBE,
        type: 'video'
    }
    
    const songArg = await search(args.join(' '), opts)
    const songURL = songArg.results[0].link
    const songInfo = await ytdl.getInfo(songURL)

    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
        author: message.author.tag
    }
    
    if (!serverQueue) {
        const queueObject = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        }
        queue.set(message.guild.id, queueObject)
        queueObject.songs.push(song)
        try {
            let connection = await voiceChannel.join()
            queueObject.connection = connection
            musicchannel.send(`🎷 Reproduciendo: **${song.title}**`)
            play(message.guild, queueObject.songs[0])
            message.delete()
           
        } catch (err) {
            console.log(err)
            queue.delete(message.guild.id)
            return musicchannel.send(err)
        }
    }else {
        serverQueue.songs.push(song)
        message.delete()
        return musicchannel.send(`**${song.title}** añadida a la lista!, por: **${message.author.tag}**`)
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave()
        queue.delete(guild.id)
        return
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url))
        .on('finish', () => {
            serverQueue.songs.shift()
            play(guild, serverQueue.songs[0])
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 50)
}