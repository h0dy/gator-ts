import { getFeedByURL } from "src/lib/db/queries/feeds";
import {
  createFeedFollow,
  getFeedFollowsForUser,
  unfollowFeed,
  type FeedsFollow,
} from "src/lib/db/queries/feedFollows";
import { User } from "src/lib/db/schema";

export const handlerFollowFeed = async (
  cmdName: string,
  user: User,
  ...args: string[]
) => {
  if (args.length < 1) {
    throw new Error(`usage: ${cmdName} <feed-url>`);
  }

  const feedUrl = args[0];
  const feed = await getFeedByURL(feedUrl);

  const feedFollows = await createFeedFollow(user.id, feed.id);

  logFeedFollow(feedFollows, feed.url);
};

const logFeedFollow = (feedFollows: FeedsFollow, feedUrl: string) => {
  console.log(`
USER:
User ID: ${feedFollows.userId}
User name: ${feedFollows.username}
Follows "${feedFollows.feedName}"
Feed URL: ${feedUrl}
`);
};

export const handlerFollowingFeeds = async (_: string, user: User) => {
  const followFeeds = await getFeedFollowsForUser(user.id);
  console.log(`${user.name} follows:`);
  for (let f of followFeeds) {
    console.log(`================================
Feed name: ${f.feedName}
Feed URL: ${f.feedURL}`);
  }
};

export const handlerUnfollowFeed = async (
  cmdName: string,
  user: User,
  ...args: string[]
) => {
  if (args.length < 1) {
    throw new Error(`usage: ${cmdName} <feed-url>`);
  }

  const feedUrl = args[0];
  const feed = await getFeedByURL(feedUrl);
  await unfollowFeed(user.id, feed.id);

  console.log(`${user.name} unfollowed ${feed.name} successfully`);
};
