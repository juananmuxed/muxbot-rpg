import { CommandList } from "./../_Commands";
import { client } from "./../index";
import { Interaction } from "discord.js";

export const interactionCreate = async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    for (const Command of CommandList) {
      if (interaction.commandName === Command.data.name) {
        await Command.run(interaction, client);
        break;
      }
    }
  }
};
