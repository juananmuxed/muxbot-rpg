import { Client, Message, TextChannel } from "discord.js";
import { queue } from "./../index";
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
  serverQueue.connection.dispatcher.resume();
  message.delete();
  musicChannel.send("💖 " + _("Resumed song.", lang));
};
