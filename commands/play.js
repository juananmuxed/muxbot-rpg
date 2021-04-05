const ytdl = require('ytdl-core');
const search = require('youtube-search');
const { queue } = require('../index');
const { _ } = require('./../utils/utils');

exports.run = async (client, message, args, lang) => {
    const serverQueue = queue.get(message.guild.id),
        channelid = message.channel.id,
        musicchannel = client.channels.cache.get(process.env.MUSIC_CHANNEL),
        voiceChannel = client.channels.cache.get(process.env.RADIO_CHANNEL);
    try {
        if(channelid !== musicchannel.id) return;

        const permissions = voiceChannel.permissionsFor(message.client.user)
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return musicchannel.send(_('Needed permissions for connect and talk!',lang));

        const opts = {
            maxResults: 1,
            key: process.env.KEY_YOUTUBE,
            type: 'video'
        },
        songArg = await search(args.join(' '), opts);
        
        if(songArg.results.length == 0) {
            message.delete({timeout:4000}); 
            return musicchannel.send(_('Incorrect link! No search results!',lang)).then(message => message.delete({timeout:4000}));
        }

        const songURL = songArg.results[0].link,
            songInfo = await ytdl.getInfo(songURL),
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                author: message.author.tag
            };
        
        if (!serverQueue) {
            const queueObject = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 10,
                playing: true,
            }
            queue.set(message.guild.id, queueObject)
            queueObject.songs.push(song)
            try {
                let connection = await voiceChannel.join()
                queueObject.connection = connection
                musicchannel.send(`🎷 ${_('Playing',lang)}: **${song.title}**`)
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
            return musicchannel.send(`**${song.title}** ${_('added to queue',lang)}, ${_('by',lang)}: **${message.author.tag}**`)
        }
    } catch (error) {
        console.log(error)
        musicchannel.send(_('Error',lang) + ': ' + error.response.data.error.message)
    }
}

async function play(guild, song) {
    try {        
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
    } catch (error) {
        console.log(error)
    }
}