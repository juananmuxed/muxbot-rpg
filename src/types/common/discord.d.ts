import { Collection } from "discord.js";
import DisTube from "distube";
import { LanguageModule } from "../ILanguage";

declare module "discord.js" {
  export interface Client {
    commands: Collection;
    disTube: DisTube;
    lang: string;
  }
}
