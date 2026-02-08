import { readConfig } from "./config.js";
import { addFeed, getFeeds } from "./lib/db/queries/feeds.js";
import { createFeedFollow } from "./lib/db/queries/follows.js";
import { getUser, getUserById } from "./lib/db/queries/users.js";
import { Feed } from "./lib/db/schema.js";
import { printCreatedFeed, printFollow } from "./prints.js";
import { isConfigUsername, isUser } from "./utils.js";

export async function handlerAddfeed(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length <= 1) {
    throw new Error(`Feed name or url not provided: ${cmdName} <name> <url>`);
  }

  const config = await readConfig();
  const currentUserName = isConfigUsername(config.currentUserName); // error thrown or string

  const [feedName, feedUrl] = args;
  const user = await getUser(currentUserName);
  isUser(currentUserName, user);

  const feed = await addFeed(feedName, feedUrl, user.id);
  if (!feed) {
    throw new Error(`Feed from ${feedUrl} already exists.`);
  }
  
  const feedFollow = await createFeedFollow(user.id, feed.id);
  printFollow(feedFollow);
  
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

async function printFeeds(feeds: Feed[]): Promise<void> {
  console.log("=== Feeds ===\n");

  let count = 1;
  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`Failde to find user for feed ${feed.id}`);
    }

    console.log(`Feed ${count}: `);

    console.log(` * createdBy: ${user.name}`);
    console.log(` * name: ${feed.name}`);
    console.log(` * url: ${feed.url}`);

    if (count < feeds.length) {
      console.log();
    }

    count += 1;
  }

  console.log("\n=============");
}
