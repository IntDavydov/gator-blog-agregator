import { getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds.js";
import { fetchFeed } from "./rss.js";
import { isOneArg, parseDuration, savePosts } from "./utils.js";

export async function handlerAgg(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  isOneArg(args, `Refetch time is not provided: ${cmdName} <1s/m/h>`); // throw error if not one arg

  const time = args[0];
  const timeBetweenReqs = parseDuration(time); // throw error or parsed time in milliseconds

  console.log(`Collecting feeds every ${time}`);
  scrapeFeeds().catch(handleError);

  let requests = 1;
  const id = setInterval(() => {
    scrapeFeeds().catch(handleError);
    requests++;
  }, timeBetweenReqs);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log(`\nShutting down feed aggregator, requests made: ${requests}`);
      clearInterval(id);
      resolve();
    });
  });
}

async function scrapeFeeds(): Promise<void> {
  const nextFeed = await getNextFeedToFetch();
  if (!nextFeed) {
    throw new Error("No feeds yet");
  }

  console.log("Marking feed as fetched");
  await markFeedFetched(nextFeed.id);

  const feedContent = await fetchFeed(nextFeed.url);
  if (!feedContent) {
    throw new Error("Error: fetching rssFeed");
  }

  await savePosts(feedContent, nextFeed.id);
}

function handleError(err: Error) {
  console.error(`Something went wrong: ${err.message}`);
}
