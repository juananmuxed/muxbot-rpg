import { validateEnv } from "./utils/validateEnv";
import {
  Client,
  ClientOptions,
  Collection,
  Intents,
} from "discord.js";
import "dotenv/config";
import { ready } from "./events/ready";
import { interactionCreate } from "./events/interactionCreate";
import { clientDisTube } from "./events/clientDisTube";

export const queue = new Map();
const options: ClientOptions = {
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
};
const client = new Client(options);
client.commands = new Collection();

(async () => {
  if (!validateEnv()) return;

  client.on("ready", () => ready(client));

  client.on(
    "interactionCreate",
    async (interaction) => await interactionCreate(interaction)
  );

  clientDisTube();

  client.login(process.env.DISCORD_TOKEN);
})();

export { client };
