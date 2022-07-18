import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildMember } from "discord.js";
import { Command, getCommands } from "../types/ICommand";
import { _ } from "../utils/utils";

class Constants {
  static readonly COMMAND_NAME = "volume";
  static readonly PERCENT_NAME = "percent";
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
    .setDescription(`🔊 ${_("Set volume", lang)}`)
    .addNumberOption((option) =>
      option
        .setName(_(Constants.PERCENT_NAME, lang))
        .setDescription(_("0 to 100 percent volume", lang))
    );
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

    let volume =
      interaction.options.getNumber(
        _(Constants.PERCENT_NAME, lang)
      ) || "";

    if (volume > 100) volume = 100;
    if (volume < 0) volume = 0;
    if (!volume) volume = 50;

    client.disTube.setVolume(voiceChannel, Number(volume));

    client.lang = lang;

    interaction.reply({
      ephemeral: true,
      content: `🔊 ${_("Volume to", lang)} ${volume}%`,
    });
  };

const commands: Command[] = getCommands(
  Constants.COMMAND_NAME,
  getSlashCommand,
  getInteraction
);

export { commands };
