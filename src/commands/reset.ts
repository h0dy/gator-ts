import { deleteAllUsers } from "src/lib/db/queries/users";

export const handlerReset = async (_: string) => {
  await deleteAllUsers();
};
