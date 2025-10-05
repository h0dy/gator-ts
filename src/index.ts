import {
  CommandsRegistery,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { handlerLogin } from "./commands/users.js";

// postgres://postgres:hodypostgres@localhost:5432/gator?sslmode=disable
function main() {
  if (process.argv.length <= 2) {
    console.error("Usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = process.argv[2];
  const cmdArgs = process.argv.slice(3);
  let commands: CommandsRegistery = {};

  registerCommand(commands, "login", handlerLogin);

  try {
    runCommand(commands, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Unknown error running ${cmdName} command: ${err}`);
    }
    process.exit(1);
  }
}
main();
