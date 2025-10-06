import { fetchFeed } from "src/lib/rss.js";

export const handlerFeed = async (cmdName: string, ...args: string[]) => {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  const feedStr = JSON.stringify(feed, null, 2);
  console.log(feedStr);
};
