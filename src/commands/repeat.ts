import { SlashCommandBuilder } from "@discordjs/builders";
import {
  Client,
  CommandInteraction,
  GuildMember,
  Interaction,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { Command, getCommands } from "../types/ICommand";
import { _ } from "../utils/utils";

class Constants {
  static readonly COMMAND_NAME = "repeat";
  static readonly DISABLE_BTN = "disableRepeat";
  static readonly ALL_BTN = "repeatAll";
  static readonly ONE_BTN = "repeatOne";
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
    .setDescription(`🔁 ${_("Repeat mode", lang)}`);
};

const getInteraction =
  (lang: string = "en") =>
  async (interaction: CommandInteraction, client: Client) => {
    const { member, channel } = interaction;
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

    const repeatModes = [
      {
        text: `🚫 ${_("Disable", lang)}`,
        value: Constants.DISABLE_BTN,
      },
      {
        text: `🔁 ${_("Repeat all", lang)}`,
        value: Constants.ALL_BTN,
      },
      {
        text: `🔂 ${_("Repeat one", lang)}`,
        value: Constants.ONE_BTN,
      },
    ];

    const buttonDisabled = new MessageButton()
      .setCustomId(Constants.DISABLE_BTN)
      .setLabel(repeatModes[0].text)
      .setStyle("DANGER");

    const buttonAll = new MessageButton()
      .setCustomId(Constants.ALL_BTN)
      .setLabel(repeatModes[1].text)
      .setStyle("PRIMARY");

    const buttonOne = new MessageButton()
      .setCustomId(Constants.ONE_BTN)
      .setLabel(repeatModes[2].text)
      .setStyle("SUCCESS");

    const row = new MessageActionRow().addComponents([
      buttonAll,
      buttonOne,
      buttonDisabled,
    ]);

    await interaction.deferReply({
      ephemeral: true,
    });

    await interaction.editReply({
      content: `🔁 ${_("Select repeat mode", lang)}`,
      components: [row],
    });

    const filter = (btnInteraction: Interaction) => {
      return btnInteraction.user.id === interaction.user.id;
    };

    const collector = channel?.createMessageComponentCollector({
      filter,
      max: 1,
    });

    collector?.on("end", async (collection) => {
      if (collection.first()?.customId === Constants.DISABLE_BTN)
        client.disTube.setRepeatMode(queue, 0);
      if (collection.first()?.customId === Constants.ALL_BTN)
        client.disTube.setRepeatMode(queue, 2);
      if (collection.first()?.customId === Constants.ONE_BTN)
        client.disTube.setRepeatMode(queue, 1);

      await interaction.editReply({
        content: repeatModes[queue.repeatMode].text,
        components: [],
      });
    });
  };

const commands: Command[] = getCommands(
  Constants.COMMAND_NAME,
  getSlashCommand,
  getInteraction
);

export { commands };
