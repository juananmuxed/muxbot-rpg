import { MessageEmbed } from "discord.js";
import { DisTube, Queue, Song } from "distube";
import { client } from "..";

export const clientDisTube = () => {
  client.disTube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    youtubeDL: false,
  });

  const status = (queue: Queue) =>
    `Volume: \`${queue.volume}%\` | Filter: \`${
      queue.filters.join(", ") || "Off"
    }\` | Loop: \`${
      queue.repeatMode
        ? queue.repeatMode === 2
          ? "All Queue"
          : "This Song"
        : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

  client.disTube.on("playSong", (queue: Queue, song: Song) =>
    queue.textChannel?.send({
      embeds: [
        new MessageEmbed()
          .setColor("GREEN")
          .setDescription(
            `🎵 | Playing \`${song.name}\` - \`${
              song.formattedDuration
            }\`\nRequested by: ${song.user}\n${status(queue)}`
          ),
      ],
    })
  );
};
