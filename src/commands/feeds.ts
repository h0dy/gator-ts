import { readConfig } from "src/config";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

export const handlerAddFeed = async (cmdName: string, ...args: string[]) => {
  if (args.length < 2) {
    throw new Error(`usage: ${cmdName} <feed-name> <feed-url>`);
  }

  const feedName = args[0];
  const feedUrl = args[1];

  const currentUser = readConfig().currentUserName;
  const user = await getUser(currentUser);
  if (!user) {
    throw new Error(`User ${currentUser} not found`);
  }
  const feed = await createFeed(feedName, feedUrl, user.id);
  if (!feed) throw new Error(`error in creating a feed`);

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

export const hanlderListFeeds = async (_: string) => {
  const feeds = await getFeeds();
  for (let feed of feeds) {
    console.log("=====================================");
    logFeed(feed as Feed, feed.createdBy);
  }
};
