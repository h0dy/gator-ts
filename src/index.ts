import { handlerFeed } from "./commands/aggregate";
import {
  CommandsRegistery,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { handlerAddFeed, hanlderListFeeds } from "./commands/feeds";
import { handlerReset } from "./commands/reset";
import {
  handlerListUsers,
  handlerLogin,
  handlerRegister,
} from "./commands/users.js";

async function main() {
  if (process.argv.length <= 2) {
    console.error("Usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = process.argv[2];
  const cmdArgs = process.argv.slice(3);
  let commands: CommandsRegistery = {};

  registerCommand(commands, "login", handlerLogin);
  registerCommand(commands, "register", handlerRegister);
  registerCommand(commands, "reset", handlerReset);
  registerCommand(commands, "users", handlerListUsers);
  registerCommand(commands, "agg", handlerFeed);
  registerCommand(commands, "addfeed", handlerAddFeed);
  registerCommand(commands, "feeds", hanlderListFeeds);

  try {
    await runCommand(commands, cmdName, ...cmdArgs);
    process.exit(0);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}:\n${err.message}`);
    } else {
      console.error(`Unknown error running ${cmdName} command: ${err}`);
    }
    process.exit(1);
  }
}
main();
