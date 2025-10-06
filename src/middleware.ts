import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";
import { UserCommandHanlder } from "./commands/commands";

export const middlewareLoggedIn = (handler: UserCommandHanlder) => {
  return async (cmdName: string, ...args: string[]) => {
    const currentUser = readConfig().currentUserName;
    const user = await getUser(currentUser);
    if (!user) {
      throw new Error(`User ${currentUser} not found, make sure to register`);
    }
    return handler(cmdName, user, ...args);
  };
};
