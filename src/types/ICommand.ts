import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { APIMessage } from "discord-api-types/v9";
import { Client, CommandInteraction, Message } from "discord.js";
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
  run: (
    interaction: CommandInteraction,
    client: Client
  ) => Promise<void | APIMessage | Message<boolean>>;
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
  ) => (
    interaction: CommandInteraction,
    client: Client
  ) => Promise<void | APIMessage | Message<boolean>>
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
