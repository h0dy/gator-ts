import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { createPost } from "src/lib/db/queries/posts";
import { Feed } from "src/lib/db/schema";
import { fetchFeed } from "src/lib/rss.js";
import { parseDuration } from "src/lib/time";

export const handlerFeed = async (cmdName: string, ...args: string[]) => {
  if (args.length < 1) {
    throw new Error(`usage: ${cmdName} <time-between-requests>`);
  }

  const timeBetweenRqs = parseDuration(args[0]);
  if (!timeBetweenRqs) {
    throw new Error(
      `invalid duration: ${args[0]} — use format 1h 30m 15s or 3500ms`
    );
  }

  console.log(`collecting feeds every ${timeBetweenRqs}...`);

  scrapeFeeds().catch(handleError);

  const intervalId = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRqs);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(intervalId);
      resolve();
    });
  });
};

const scrapeFeeds = async () => {
  const nextFeed = await getNextFeedToFetch();

  console.log("Found a feed to fetch");
  scrapeFeed(nextFeed);
};

const scrapeFeed = async (feed: Feed) => {
  await markFeedFetched(feed.id);

  const feedData = await fetchFeed(feed.url);

  for (let item of feedData.channel.item) {
    console.log(`Found post: ${item.title}`);
    await createPost({
      title: item.title,
      url: item.link,
      feedId: feed.id,
      description: item.description,
      publishedAt: new Date(item.pubDate),
    });
  }

  console.log("============================================================");
  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`
  );
  console.log("============================================================");
};

const handleError = (err: unknown) => {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`
  );
};
