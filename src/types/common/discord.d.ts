import { Collection } from "discord.js";
import DisTube from "distube";

declare module "discord.js" {
  export interface Client {
    commands: Collection;
    disTube: DisTube;
  }
}
