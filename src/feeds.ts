import { addFeed, getFeeds } from "./lib/db/queries/feeds.js";
import { createFeedFollow } from "./lib/db/queries/follows.js";
import { User } from "./lib/db/schema.js";
import { printCreatedFeed, printFeeds, printFollowUnfollow } from "./prints.js";

export async function handlerAddfeed(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length <= 1) {
    throw new Error(`Feed name or url not provided: ${cmdName} <name> <url>`);
  }
  
  const [feedName, feedUrl] = args;

  const feed = await addFeed(feedName, feedUrl, user.id);
  if (!feed) {
    throw new Error(`Feed from ${feedUrl} already exists.`);
  }
  
  const feedFollow = await createFeedFollow(user.id, feed.id);
  printFollowUnfollow(feedFollow, "followed");
  
  printCreatedFeed(user, feed);
}

export async function handlerFeeds(_: string): Promise<void> {
  const feeds = await getFeeds(); // empty array or array of Feed objects

  if (feeds.length === 0) {
    console.log("=== No feeds yet ===");
    return;
  }

  await printFeeds(feeds);
}
