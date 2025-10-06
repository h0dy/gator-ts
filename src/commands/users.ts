import { createUser, getUser, getUsers } from "src/lib/db/queries/users.js";
import { readConfig, setUser } from "../config.js";

export const handlerLogin = async (cmdName: string, ...args: string[]) => {
  if (args.length < 1) throw new Error(`usage: ${cmdName} <name>`);

  const username = args[0];
  try {
    const user = await getUser(username);
    setUser(username);
    logUser(user.name, user.id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `user with the name ${username} doesn't exist\nmake sure to register with "register <name>" command`
      );
    } else {
      throw new Error("");
    }
  }
  console.log("User switched/set successfully!");
};

export const handlerRegister = async (cmdName: string, ...args: string[]) => {
  if (args.length < 1) throw new Error(`usage: ${cmdName} <name>`);

  const username = args[0];
  try {
    const user = await createUser(username);
    setUser(user.name);
    logUser(user.name, user.id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("user already exist\ntry login <name>");
    }
    throw new Error("Error in creating a user");
  }
};

const logUser = (username: string, userId: string) => {
  console.log(`USER ID: ${userId}`);
  console.log(`USER Name: ${username}`);
};

export const handlerListUsers = async (_: string) => {
  const users = await getUsers();
  const currentUser = readConfig().currentUserName;
  if (users.length == 0) {
    console.log("there are no users");
  }
  for (let user of users) {
    if (currentUser == user.name) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
};
