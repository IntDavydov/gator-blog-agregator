import { readConfig } from "./config.js";
import { addFeed, getFeeds } from "./lib/db/queries/feeds.js";
import { getUser, getUserById } from "./lib/db/queries/users.js";
import { Feed, User } from "./lib/db/schema.js";

export async function handlerAddfeed(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length <= 1) {
    throw new Error(`Feed name or url not provided: ${cmdName} <name> <url>`);
  }

  const config = await readConfig();
  if (!config.currentUserName) {
    throw new Error("You're not logged in.");
  }

  const [feedName, feedUrl] = args;
  const user = await getUser(config.currentUserName);

  if (!user) {
    throw new Error(
      `User ${config.currentUserName} is not registered in data base. Try to register again.`,
    );
  }

  const feed = await addFeed(feedName, feedUrl, user.id);

  if (!feed) {
    throw new Error(`Feed from ${feedUrl} already exists.`);
  }

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

function printCreatedFeed(user: User, feed: Feed): void {
  console.log("=== Feed created successfuly ===\n");
  console.log("User: ", user.name);
  console.log("Created a feed: ");
  console.log(`* name: ${feed.name}`);
  console.log(`* url: ${feed.url}`);
  console.log("\n================================");
}

async function printFeeds(feeds: Feed[]): Promise<void> {
  console.log("=== Feeds ===\n");
  
  let count = 1;
  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if(!user) {
      throw new Error(`Failde to find user for feed ${feed.id}`)
    }

    console.log(`Feed ${count}: `)

    console.log(` * createdBy: ${user.name}`);
    console.log(` * name: ${feed.name}`);
    console.log(` * url: ${feed.url}`);

    if(count < feeds.length) {
      console.log()
    }

    count += 1;
  }
  
  console.log("\n=============");
}
