import { createFeed, getFeedByURL, getFeeds } from "src/lib/db/queries/feeds";
import { createFeedFollow } from "src/lib/db/queries/feedFollows";
import { Feed, User } from "src/lib/db/schema";

export const handlerAddFeed = async (
  cmdName: string,
  user: User,
  ...args: string[]
) => {
  if (args.length < 2) {
    throw new Error(`usage: ${cmdName} <feed-name> <feed-url>`);
  }

  const feedName = args[0];
  const feedUrl = args[1];

  const feed = await createFeed(feedName, feedUrl, user.id);
  if (!feed) throw new Error(`error in creating a feed`);
  await createFeedFollow(user.id, feed.id);

  console.log("Feed created successfully!");
  logFeed(feed, user);
};

const logFeed = (feed: Feed, user: User) => {
  console.log(`
* ID:         ${feed.id}
* Name:       ${feed.name}
* URL:        ${feed.url}
* Created:    ${feed.createdAt}
* Updated:    ${feed.updatedAt}
* Created by: ${user.name}
`);
};

export const handlerListFeeds = async (_: string) => {
  const feeds = await getFeeds();
  for (let feed of feeds) {
    console.log("=====================================");
    logFeed(feed as Feed, feed.createdBy);
  }
};
