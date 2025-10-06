import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";

export const createFeed = async (
  feedName: string,
  url: string,
  userId: string
) => {
  const [feed] = await db
    .insert(feeds)
    .values({
      name: feedName,
      url,
      userId,
    })
    .returning();
  return feed;
};

export const getFeeds = async () => {
  const result = await db
    .select({
      id: feeds.id,
      name: feeds.name,
      url: feeds.url,
      createdAt: feeds.createdAt,
      updatedAt: feeds.updatedAt,
      userId: feeds.userId,
      createdBy: users,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));
  return result;
};
