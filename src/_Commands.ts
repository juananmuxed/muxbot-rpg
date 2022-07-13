import { commands as rolls } from "./commands/dice";
import { commands as plays } from "./commands/play";
import { Command } from "./types/ICommand";

export const CommandList: Command[] = [...rolls, ...plays];
