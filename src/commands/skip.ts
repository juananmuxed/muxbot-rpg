import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildMember } from "discord.js";
import { Command, getCommands } from "../types/ICommand";
import { _ } from "../utils/utils";

class Constants {
  static readonly COMMAND_NAME = "skip";
}

const getSlashCommand = (
  name: string,
  lang: string = "en"
): Omit<
  SlashCommandBuilder,
  "addSubcommand" | "addSubcommandGroup"
> => {
  return new SlashCommandBuilder()
    .setName(_(name, lang))
    .setDescription(`⏭️ ${_("Skip song", lang)}`);
};

const getInteraction =
  (lang: string = "en") =>
  async (interaction: CommandInteraction, client: Client) => {
    const { member } = interaction;
    const voiceChannel = (member as GuildMember)?.voice.channel;

    if (!voiceChannel)
      return interaction.reply({
        content: `⛔ ${_("You must be in a voice channel", lang)}`,
        ephemeral: true,
      });

    const queue = client.disTube.getQueue(voiceChannel);
    if (!queue)
      return interaction.reply({
        content: `⛔ ${_("There is no queue", lang)}`,
      });

    if (queue.autoplay || queue.songs.length > 1)
      await client.disTube.skip(voiceChannel);
    else await client.disTube.stop(voiceChannel);

    interaction.reply({
      ephemeral: true,
      content: `⏭️ ${_("Song has been skipped", lang)}`,
    });
  };

const commands: Command[] = getCommands(
  Constants.COMMAND_NAME,
  getSlashCommand,
  getInteraction
);

export { commands };
