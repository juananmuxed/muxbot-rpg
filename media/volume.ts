import { Message, TextChannel, Client } from "discord.js";
import { queue } from "./../index";
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
    ) as TextChannel;

  if (!message.member?.voice.channel) {
    message.delete();
    return musicChannel?.send(
      "🧠 " + _("You must join a voice channel", lang)
    );
  }
  if (!serverQueue) {
    message.delete();
    return musicChannel.send(
      "😭 " + _("¡No music!, empty queue.", lang)
    );
  }
  const countVolume = parseInt(args[0] || 50);
  if (!args.join(" ") || countVolume < 100) {
    const dispatcher = serverQueue.connection.dispatcher;
    await dispatcher.setVolume(
      Math.min((dispatcher.volume = countVolume / 50))
    );
    message.delete();
    return musicChannel.send(
      `🔊 **${_("Volume", lang)}: \`${Math.round(
        dispatcher.volume * 50
      )}\`%**`
    );
  } else {
    message.delete();
    return musicChannel.send(
      "💉 " + _("Add a value between 1 and 100", lang)
    );
  }
};
