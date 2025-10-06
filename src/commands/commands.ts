import { User } from "../lib/db/schema";

export type CommandsRegistery = Record<string, CommandHandler>;

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type UserCommandHanlder = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export const registerCommand = (
  registry: CommandsRegistery,
  cmdName: string,
  handler: CommandHandler
): void => {
  registry[cmdName] = handler;
};

export const runCommand = async (
  registry: CommandsRegistery,
  cmdName: string,
  ...args: string[]
) => {
  const cmdFunc = registry[cmdName];
  if (!cmdFunc) throw new Error(`Unknown command: ${cmdName}`);
  await cmdFunc(cmdName, ...args);
};
