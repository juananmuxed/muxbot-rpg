import { queue } from "./../index";
import { Message, TextChannel, Client } from "discord.js";
import { _ } from "../utils/utils";
import { VideoDetails } from "ytdl-core";

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

  if (!message.member?.voice.channel) {
    message.delete();
    return musicChannel.send(
      "🧠 " + _("You must join a voice channel", lang)
    );
  }

  if (!serverQueue) {
    message.delete();
    return musicChannel.send(
      "😭 " + _("¡No music!, empty queue.", lang)
    );
  }

  let i = 1;
  let list = _("No more songs", lang) + "\n";

  if (serverQueue.songs.length != 1) {
    list = serverQueue.songs
      .slice(1)
      .map((m: VideoDetails) => {
        if (i > 16) return;
        i++;
        return `[${i}] - 🎵 ${m.title}  / 👤 ${_("by", lang)}: ${
          m.author
        }`;
      })
      .join("\n");
  }

  const hr = "---------------------------------------------",
    playName = `${hr}\n🔊 ${_("Now", lang)}: ${
      serverQueue.songs[0].title
    }\n👤 ${_("by", lang)}: ${serverQueue.songs[0].author}\n${hr}`,
    countSong = `\n${hr}\n📒 ${_("Queue", lang)} ${
      serverQueue.songs.length
    }/15 ${_("songs", lang)}.`;

  message.delete();

  musicChannel.send(
    "```xl\n[" +
      _("SONGS QUEUE", lang) +
      "]\n" +
      playName +
      "\n\n" +
      list +
      "\n" +
      countSong +
      "\n```"
  );
};
