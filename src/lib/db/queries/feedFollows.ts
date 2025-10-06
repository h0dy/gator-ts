import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feeds, feedFollows, users } from "../schema";

export const createFeedFollow = async (userId: string, feedId: string) => {
  await db.insert(feedFollows).values({ feedId, userId });
  const [feedFollowInfo] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      username: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(users.id, userId));

  return feedFollowInfo;
};

export type FeedsFollow = Awaited<ReturnType<typeof createFeedFollow>>;

export const getFeedFollowsForUser = async (userId: string) => {
  const feedFollowsUser = await db
    .select({
      username: users.name,
      userId: users.id,
      feedName: feeds.name,
      feedURL: feeds.url,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(users.id, userId));
  return feedFollowsUser;
};

export const unfollowFeed = async (userId: string, feedId: string) => {
  await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)));
};
