import { SlashCommandBuilder } from "@discordjs/builders";
import {
  Client,
  CommandInteraction,
  MessageEmbed,
  GuildMember,
  VoiceBasedChannel,
} from "discord.js";
import { Command, getCommands } from "../types/ICommand";
import { _ } from "../utils/utils";

class Constants {
  static readonly COMMAND_NAME = "play";
  static readonly QUERY_NAME = "query";
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
    .setDescription(`🎷 ${_("Music play", lang)}`)
    .addStringOption((option) =>
      option
        .setName(_(Constants.QUERY_NAME, lang))
        .setDescription(_("URL or YT code", lang))
    );
};

const getInteraction =
  (lang: string = "en") =>
  async (interaction: CommandInteraction, client: Client) => {
    const query =
      interaction.options.getString(_(Constants.QUERY_NAME, lang)) ||
      "";

    if (!query)
      return interaction.reply({
        content: `⛔ ${_("You need a query to search", lang)}`,
        ephemeral: true,
      });

    const { member, channel } = interaction;
    const voiceChannel = (member as GuildMember)?.voice.channel;

    if (!voiceChannel)
      return interaction.reply({
        content: `⛔ ${_("You must be in a voice channel", lang)}`,
        ephemeral: true,
      });

    client.lang = lang;

    try {
      await interaction.deferReply({
        ephemeral: true,
      });

      await client.disTube.play(
        voiceChannel as VoiceBasedChannel,
        query,
        {
          textChannel: channel as any,
          member: member as GuildMember,
        }
      );

      return interaction.editReply({
        content: `😎 ${_("Song added", lang)}`,
      });
    } catch (e) {
      const errorEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`🚨 ${_("Alert", lang)}: ${e}`);
      return interaction.reply({ embeds: [errorEmbed] });
    }
  };

const commands: Command[] = getCommands(
  Constants.COMMAND_NAME,
  getSlashCommand,
  getInteraction
);

export { commands };
