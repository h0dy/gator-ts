import { setUser } from "../config.js";
import { commandHandler } from "./commands.js";

export const handlerLogin: commandHandler = (
  cmdName: string,
  ...args: string[]
) => {
  if (args.length < 1) throw new Error(`usage: ${cmdName} <name>`);

  const username = args[0];
  setUser(username);
  console.log("User switched/set successfully!");
};
