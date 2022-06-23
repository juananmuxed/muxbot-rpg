import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import { Client } from "discord.js";
import { CommandList } from "../_Commands";

export const ready = async (client: Client): Promise<void> => {
  if (!client.user || !client.application) {
    return;
  }
  const rest = new REST({ version: "9" }).setToken(
    process.env.DISCORD_TOKEN as string
  );

  const commandData = CommandList.map((command) =>
    command.data.toJSON()
  );

  await rest.put(
    Routes.applicationGuildCommands(
      client.user?.id || "missing id",
      process.env.GUILD_ID as string
    ),
    { body: commandData }
  );

  console.log(`🟢 ${client.user?.username} inda haus!`);

  client.user?.setPresence({
    activities: [
      {
        name: `${client.users.cache.size} souls. 🤖`,
        type: "WATCHING",
      },
    ],
    status: "online",
  });
};
