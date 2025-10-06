import { eq, InferSelectModel } from "drizzle-orm";
import { db } from "..";
import { feeds, feedsFollows, users } from "../schema";

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

export const createFeedFollow = async (userId: string, feedId: string) => {
  await db.insert(feedsFollows).values({ feedId, userId });
  const [feedFollowInfo] = await db
    .select({
      id: feedsFollows.id,
      createdAt: feedsFollows.createdAt,
      updatedAt: feedsFollows.updatedAt,
      userId: feedsFollows.userId,
      feedId: feedsFollows.feedId,
      username: users.name,
      feedName: feeds.name,
    })
    .from(feedsFollows)
    .innerJoin(feeds, eq(feedsFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedsFollows.userId, users.id))
    .where(eq(users.id, userId));

  return feedFollowInfo;
};

export type FeedsFollow = Awaited<ReturnType<typeof createFeedFollow>>;

export const getFeedFollowsForUser = async (userId: string) => {
  const feedFollows = await db
    .select({
      username: users.name,
      userId: users.id,
      feedName: feeds.name,
      feedURL: feeds.url,
    })
    .from(feedsFollows)
    .innerJoin(feeds, eq(feedsFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedsFollows.userId, users.id))
    .where(eq(users.id, userId));
  return feedFollows;
};
