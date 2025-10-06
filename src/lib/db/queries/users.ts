import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export const createUser = async (name: string) => {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
};

export const getUser = async (name: string) => {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  return result;
};

export const getUsers = async () => {
  const results = await db.select().from(users);
  return results;
};

export const deleteAllUsers = async () => {
  await db.delete(users);
  console.log("Users table reset successfully");
};
