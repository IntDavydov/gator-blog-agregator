import { XMLParser } from "fast-xml-parser";

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const res = await fetch(feedURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/rss+xml",
      "User-Agent": "gator",
    },
  });

  if (!res.ok) {
    throw new Error(`failed to fetch feed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const parser = new XMLParser();
  const feed = parser.parse(xml).rss;

  const channel = feed.rss?.channel;
  if (!channel || !isRSSChannel(channel)) {
    throw new Error("failed to parse channel");
  }

  let rssItems: RSSItem[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item];

  for (const item of rssItems) {
    if (!isRSSItem(item)) {
      continue;
    }

    rssItems.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  const rssFeed: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: rssItems,
    },
  };

  return rssFeed;
}

function isRSSChannel(channel: FeedChannel): channel is FeedChannel {
  if (!channel) {
    console.error("No channel in feed");
    return false;
  }

  const { title, link, description } = channel;

  if (
    !title ||
    typeof title !== "string" ||
    !link ||
    typeof link !== "string" ||
    !description ||
    typeof description !== "string"
  ) {
    console.error("Wrong data type or lack of fields");
    return false;
  }

  return true;
}

function isRSSItem(item: RSSItem): item is RSSItem {
  const { title, link, description, pubDate } = item;

  return (
    typeof title === "string" &&
    typeof link === "string" &&
    typeof description === "string" &&
    typeof pubDate === "string"
  );
}

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type FeedChannel = RSSFeed["channel"];

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};
