import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { LanguageModule } from "./ILanguage";

export interface Command {
  data:
    | Omit<
        SlashCommandBuilder,
        "addSubcommandGroup" | "addSubcommand"
      >
    | SlashCommandSubcommandsOnlyBuilder;
  run: (interaction: CommandInteraction) => Promise<void>;
}

export const getCommands = (
  name: string,
  data: (
    name: string,
    lang?: string
  ) => Omit<
    SlashCommandBuilder,
    "addSubcommand" | "addSubcommandGroup"
  >,
  interaction: (
    lang?: string
  ) => (interaction: CommandInteraction) => Promise<void>
) => {
  const commands: Command[] = [];
  commands.push({
    data: data(name),
    run: interaction(),
  });

  const languagePath = path.join(__dirname, "../language/");
  const languageFiles = readdirSync(languagePath).filter((file) =>
    file.endsWith(".js")
  );

  languageFiles.forEach((file) => {
    const filePath = path.join(languagePath, file);
    const [fileName, type] = file.split(".");
    const lang: LanguageModule | undefined = require(filePath);
    if (!lang) return;
    commands.push({
      data: data(lang.default.commands[name], fileName),
      run: interaction(fileName),
    });
  });
  return commands;
};
