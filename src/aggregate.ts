import { fetchFeed } from "./rss.js";

export async function handlerAgg(_: string): Promise<void> {
  const url = "https://www.wagslane.dev/index.xml";
  const feedContent = await fetchFeed(url);

  if (!feedContent) {
    console.log("Error: fetching rssFeed");
  }

  const feedContentJSON = JSON.stringify(feedContent, null, 2);
  console.log(feedContentJSON);
}
