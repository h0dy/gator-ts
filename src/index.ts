import { handlerFeed } from "./commands/aggregate";
import {
  CommandsRegistery,
  registerCommand,
  runCommand,
} from "./commands/commands";
import {
  handlerAddFeed,
  handlerFollowFeed,
  handlerFollowingFeeds,
  handlerListFeeds,
} from "./commands/feeds";
import { handlerReset } from "./commands/reset";
import {
  handlerListUsers,
  handlerLogin,
  handlerRegister,
} from "./commands/users.js";
import { middlewareLoggedIn } from "./middleware";

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
  registerCommand(commands, "feeds", handlerListFeeds);
  registerCommand(commands, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(commands, "follow", middlewareLoggedIn(handlerFollowFeed));
  registerCommand(
    commands,
    "following",
    middlewareLoggedIn(handlerFollowingFeeds)
  );

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
