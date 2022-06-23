import { queue } from "./../index";
import {
  TextChannel,
  Client,
  VoiceChannel,
  Message,
} from "discord.js";
import { _ } from "../utils/utils";

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
  if (serverQueue.songs.length === 1) {
    voiceChannel?.leave();
    message.delete();
    return musicChannel.send(
      "😘 " + _("Last song. List of songs stoped.", lang)
    );
  }
  message.delete();
  serverQueue.connection.dispatcher.end();
  musicChannel.send(
    `${_("Playing", lang)}: 📣 **${serverQueue.songs[1].title}**`
  );
};
