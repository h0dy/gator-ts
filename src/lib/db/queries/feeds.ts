import { asc, eq, sql } from "drizzle-orm";
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

export const getFeedByURL = async (feedUrl: string) => {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, feedUrl));
  return feed;
};

export const markFeedFetched = async (feedId: string) => {
  await db
    .update(feeds)
    .set({
      updatedAt: sql`NOW()`,
      lastFetchAt: sql`NOW()`,
    })
    .where(eq(feeds.id, feedId));
};

export const getNextFeedToFetch = async () => {
  const [feed] = await db
    .select()
    .from(feeds)
    .orderBy(sql`"last_fetch_at" IS NULL`, asc(feeds.lastFetchAt))
    .limit(1);
  
  return feed
};
