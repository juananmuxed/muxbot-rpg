import { randomColor } from "./../utils/utils";
import { SlashCommandBuilder } from "@discordjs/builders";
import { RpgUtils } from "@muxed/rpg-utils";
import {
  ColorResolvable,
  CommandInteraction,
  MessageEmbed,
} from "discord.js";
import { Command, getCommands } from "./../types/ICommand";
import { _ } from "../utils/utils";

class Constants {
  static readonly COMMAND_NAME = "dice";
  static readonly DICES_NAME = "dices";
  static readonly FACES_NAME = "faces";
  static readonly MODIFICATION_NAME = "modification";
  static readonly SECRET_NAME = "secret";
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
    .setDescription(`🎲 ${_("Launch dices", lang)}`)
    .addNumberOption((option) =>
      option
        .setName(_(Constants.DICES_NAME, lang))
        .setDescription(_("Dices number (default 1)", lang))
    )
    .addNumberOption((option) =>
      option
        .setName(_(Constants.FACES_NAME, lang))
        .setDescription(_("Faces number (default 6)", lang))
    )
    .addNumberOption((option) =>
      option
        .setName(_(Constants.MODIFICATION_NAME, lang))
        .setDescription(_("Roll modification", lang))
    )
    .addBooleanOption((option) =>
      option
        .setName(_(Constants.SECRET_NAME, lang))
        .setDescription(_("Just for you", lang))
    );
};

const getInteraction =
  (lang: string = "en") =>
  async (interaction: CommandInteraction) => {
    const dices =
      interaction.options.getNumber(_(Constants.DICES_NAME, lang)) ||
      1;
    const faces =
      interaction.options.getNumber(_(Constants.FACES_NAME, lang)) ||
      6;
    const mod = interaction.options.getNumber(
      _(Constants.MODIFICATION_NAME, lang)
    );
    const secret =
      interaction.options.getBoolean(
        _(Constants.SECRET_NAME, lang)
      ) || false;
    const { user } = interaction;

    await interaction.deferReply({
      ephemeral: secret,
    });

    const roll = new RpgUtils(faces);
    const diceRoll = await roll.rollDicesAsync(dices);
    const modRolls = roll.modifyRolls(mod || 0);
    const sum = roll.sumRolls() || 0;

    const embed = new MessageEmbed();
    embed.setTitle(_("Rolling dices", lang));
    embed.setColor(randomColor() as ColorResolvable);
    embed.setAuthor({
      name: interaction.client.user?.username || _("Roller", lang),
      iconURL: interaction.client.user?.displayAvatarURL(),
    });
    embed.setDescription(
      `${user} ${_("roll", lang)} ${dices}d${faces} 🎲`
    );
    embed.addField(_("Results", lang), JSON.stringify(diceRoll));
    if (mod) {
      embed.addField(
        _("Modified results", lang),
        JSON.stringify(modRolls)
      );
    }
    embed.addField(_("Sum", lang), sum.toString());
    if (mod) {
      embed.addField(
        _("Modified sum", lang),
        (modRolls as number[])
          .reduce((prev, curr): number => {
            return (prev += curr);
          }, 0)
          .toString()
      );
    }
    embed.setTimestamp();
    embed.setFooter({
      text: interaction.client.user?.username || _("Roller", lang),
      iconURL: interaction.client.user?.displayAvatarURL(),
    });

    await interaction.editReply({ embeds: [embed] });
  };

const commands: Command[] = getCommands(
  Constants.COMMAND_NAME,
  getSlashCommand,
  getInteraction
);

export { commands };
