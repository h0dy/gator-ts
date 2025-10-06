import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, NewPost, posts } from "../schema";

export const createPost = async ({
  title,
  url,
  description,
  feedId,
}: NewPost) => {
  const [post] = await db
    .insert(posts)
    .values({
      title,
      url,
      description,
      feedId,
    })
    .returning();
  return post;
};

export const getPostsForUser = async (userId: string, limit: number) => {
  const postsColumns = getTableColumns(posts);
  const userPosts = await db
    .select({
      ...postsColumns,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(feedFollows.feedId, posts.feedId))
    .innerJoin(feeds, eq(feeds.id, posts.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return userPosts;
};
