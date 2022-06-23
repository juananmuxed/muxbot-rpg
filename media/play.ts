import {
  Guild,
  Message,
  MessageOptions,
  TextChannel,
  User,
  VoiceChannel,
  VoiceConnection,
  Client,
} from "discord.js";
import search from "youtube-search";
import ytdl from "ytdl-core";
import { _ } from "../utils/utils";
import { queue } from "./../index";

interface IQueueObject {
  textChannel: TextChannel;
  voiceChannel: VoiceChannel;
  connection: null | VoiceConnection;
  songs: ISong[];
  volume: number;
  playing: boolean;
}

interface ISong {
  title: string;
  url: string;
  author: string;
}

export default async (
  client: Client,
  message: Message,
  args: any[],
  lang: string
) => {
  const serverQueue = queue.get(message.guild?.id);
  const musicChannel = client.channels.cache.get(
    message.channel.id
  ) as TextChannel;
  const voiceChannel = client.channels.cache.get(
    process.env.RADIO_CHANNEL || ""
  ) as VoiceChannel;
  try {
    const permissions = musicChannel.permissionsFor(
      message.client.user as User
    );
    if (!permissions?.has("CONNECT") || !permissions.has("SPEAK"))
      return musicChannel.send(
        _(
          "Needed permissions for connect and talk!",
          lang
        ) as MessageOptions
      );

    const opts = {
        maxResults: 1,
        key: process.env.KEY_YOUTUBE,
        type: "video",
      },
      songArg = await search(args.join(" "), opts);

    if (songArg.results.length == 0) {
      message.delete({ timeout: 4000 });
      return musicChannel.send(
        _(
          "Incorrect link! No search results!",
          lang
        ) as MessageOptions
      );
    }

    const songURL = songArg.results[0].link;
    const songInfo = await ytdl.getInfo(songURL);
    const song: ISong = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      author: message.author.tag,
    };

    if (!serverQueue) {
      const queueObject: IQueueObject = {
        textChannel: musicChannel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 10,
        playing: true,
      };
      queue.set(message.guild?.id, queueObject);
      queueObject.songs.push(song);

      const connection = await voiceChannel.join();
      queueObject.connection = connection;
      musicChannel.send(
        `🎷 ${_("Playing", lang)}: **${song.title}**`
      );
      await play(message.guild || undefined, queueObject.songs[0]);
    } else {
      serverQueue.songs.push(song);
      message.delete();
      return musicChannel.send(
        `**${song.title}** ${_("added to queue", lang)}, ${_(
          "by",
          lang
        )}: **${message.author.tag}**`
      );
    }
  } catch (error: any) {
    console.log(error);
    musicChannel.send(
      _("Error", lang) + ": " + error.response.data.error.message
    );
  }
};

async function play(guild: Guild | undefined, song: ISong) {
  try {
    const serverQueue = queue.get(guild?.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild?.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", (error: any) => {
        console.error(error);
      });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 50);
  } catch (error) {
    console.log(error);
  }
}
