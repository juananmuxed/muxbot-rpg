import { commands as rolls } from "./commands/dice";
import { commands as play } from "./commands/play";
import { commands as volume } from "./commands/volume";
import { commands as resume } from "./commands/resume";
import { commands as stop } from "./commands/stop";
import { commands as pause } from "./commands/pause";
import { commands as skip } from "./commands/skip";
import { commands as queue } from "./commands/queue";
import { commands as repeat } from "./commands/repeat";
import { Command } from "./types/ICommand";

export const CommandList: Command[] = [
  ...rolls,
  ...play,
  ...volume,
  ...resume,
  ...stop,
  ...pause,
  ...skip,
  ...queue,
  ...repeat,
];
