export type CommandsRegistery = Record<string, commandHandler>;

export type commandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export const registerCommand = (
  registry: CommandsRegistery,
  cmdName: string,
  handler: commandHandler
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
