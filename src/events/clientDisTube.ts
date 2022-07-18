import {
  Constants,
  GuildTextBasedChannel,
  Message,
  MessageEmbed,
} from "discord.js";
import { DisTube, Playlist, Queue, Song } from "distube";
import { client } from "..";
import { _ } from "../utils/utils";

export const clientDisTube = () => {
  client.disTube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    youtubeDL: false,
  });

  const clearPresence = (): void => {
    client.user?.setPresence({
      activities: [
        {
          name: "🤖",
          type: Constants.ActivityTypes.WATCHING,
        },
      ],
    });
  };

  const status = (queue: Queue) =>
    `${_("Volume", client.lang)}: \`${queue.volume}%\` | ${_(
      "Loop",
      client.lang
    )}: \`${
      queue.repeatMode
        ? queue.repeatMode === 2
          ? _("All queue", client.lang)
          : _("This song", client.lang)
        : _("Off", client.lang)
    }\``;

  client.disTube
    .on("playSong", (queue: Queue, song: Song) => {
      client.user?.setPresence({
        activities: [
          {
            name: song.name,
            type: Constants.ActivityTypes.LISTENING,
            url: song.url,
          },
        ],
      });

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setImage(song.thumbnail || "")
        .addField(
          `🎵 | ${_("Playing", client.lang)}`,
          song.name || _("No music data", client.lang)
        )
        .addField(_("Options", client.lang), status(queue))
        .addField(
          _("Requested by", client.lang),
          `<@${song.user?.id}>`
        );

      queue.textChannel?.send({
        embeds: [embed],
      });
    })
    .on("addSong", (queue: Queue, song: Song) => {
      const embed = new MessageEmbed()
        .setColor("GREEN")
        .addField(
          `📢 | ${_("Added song", client.lang)}`,
          song.name || _("No music data", client.lang)
        );
      queue.textChannel?.send({
        embeds: [embed],
      });
    })
    .on("addList", (queue: Queue, playlist: Playlist) => {
      const embed = new MessageEmbed()
        .setColor("GREEN")
        .addField(
          `📢 | ${_("Added playlist", client.lang)}`,
          `${playlist.name || _("No music data", client.lang)}: ${
            playlist.songs.length
          } ${
            playlist.songs.length > 1
              ? _("songs", client.lang)
              : _("song", client.lang)
          }`
        );
      queue.textChannel?.send({
        embeds: [embed],
      });
    })
    .on("error", (channel: GuildTextBasedChannel, e: Error) => {
      channel.send(
        `🚨 | ${_("Alert", client.lang)}: ${e
          .toString()
          .slice(0, 1974)}`
      );
      clearPresence();
      console.error(e);
    })
    .on("empty", (queue: Queue) => {
      const embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `🔴 | ${_(
            "Empty voice channel, leaving channel...",
            client.lang
          )}`
        );
      clearPresence();
      queue.textChannel?.send({
        embeds: [embed],
      });
    })
    .on("searchNoResult", (message: Message) => {
      const embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`🔴 | ${_("No results found", client.lang)}`);
      message.channel?.send({
        embeds: [embed],
      });
    })
    .on("finish", (queue: Queue) => {
      const embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `🔴 | ${_("Queue finished, leaving channel", client.lang)}`
        );
      clearPresence();
      queue.textChannel?.send({
        embeds: [embed],
      });
    });
};
