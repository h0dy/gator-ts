import { readConfig } from "src/config";
import {
  createFeed,
  createFeedFollow,
  FeedsFollow,
  getFeedByURL,
  getFeedFollowsForUser,
  getFeeds,
} from "src/lib/db/queries/feeds";
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
    throw new Error(`User ${currentUser} not found, make sure to register`);
  }
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

export const handlerFollowFeed = async (cmdName: string, ...args: string[]) => {
  if (args.length < 1) {
    throw new Error(`usage: ${cmdName} <feed-url>`);
  }
  const currentUser = readConfig().currentUserName;
  const user = await getUser(currentUser);
  if (!user) {
    throw new Error(`User ${currentUser} not found, make sure to register`);
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

export const handlerFollowingFeeds = async (_: string) => {
  const currentUser = readConfig().currentUserName;

  const user = await getUser(currentUser);
  if (!user) {
    throw new Error(`User ${currentUser} not found, make sure to register`);
  }

  const followFeeds = await getFeedFollowsForUser(user.id);
  console.log(`${user.name} follows:`);
  for (let f of followFeeds) {
    console.log(`================================
Feed name: ${f.feedName}
Feed URL: ${f.feedURL}`);
  }
};
