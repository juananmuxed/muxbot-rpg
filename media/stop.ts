import { queue } from "./../index";
import {
  Message,
  VoiceChannel,
  Client,
  TextChannel,
} from "discord.js";
import { _ } from "../utils/utils";

export default async (
  client: Client,
  message: Message,
  args: any[],
  lang: string
) => {
  const serverQueue = queue.get(message.guild?.id),
    musicChannel = client.channels.cache.get(
      message.channel.id
    ) as TextChannel,
    voiceChannel = client.channels.cache.get(
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
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  voiceChannel.leave();
  message.delete();
  musicChannel.send("👌 " + _("You screwed up the party...", lang));
};
