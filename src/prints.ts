import { Config } from "./config.js";
import { FeedFollowInfo, ReturnFeedFollow } from "./lib/db/queries/follows.js";
import { getUserById } from "./lib/db/queries/users.js";
import { Feed, Post, User } from "./lib/db/schema.js";
import { timeOtions } from "./utils.js";

export function printCreatedFeed(user: User, feed: Feed): void {
  console.log("=== Feed created successfuly ===\n");
  console.log("User: ", user.name);
  console.log("Created a feed: ");
  console.log(`* name: ${feed.name}`);
  console.log(`* url: ${feed.url}`);
  console.log("\n================================");
}

export function printFollowUnfollow(
  returnFeedFollow: ReturnFeedFollow,
  action: string,
): void {
  const { userName, feedName, feedUrl, createdAt } = returnFeedFollow;

  console.log(`=== You've ${action} the feed ===\n`);

  console.log(`* User name: ${userName}`);

  if (action === "followed") {
    console.log(
      `* Followed on: ${createdAt.toLocaleDateString("en-US", timeOtions)}`,
    );
  } else {
    console.log(
      `* Unfollowed on: ${new Date().toLocaleDateString("en-US", timeOtions)}`,
    );
  }

  console.log(`* Feed name: ${feedName}`);
  console.log(`* Url: ${feedUrl}`);

  console.log("\n================================");
}

export function printUserFollows(
  userName: string,
  userFeedFollows: FeedFollowInfo[],
): void {
  console.log(`=== ${userName} follows ===\n`);
  let count = 1;
  for (const userFeedFollow of userFeedFollows) {
    console.log(`Feed ${count}:`);

    console.log(` * created by: ${userFeedFollow.userName}`);
    console.log(` * name: ${userFeedFollow.feedName}`);
    console.log(` * url: ${userFeedFollow.feedUrl}`);
    if (count < userFeedFollows.length) {
      console.log();
    }
    count += 1;
  }
  console.log("\n===========================");
}

export function printSuccess(
  config: Config,
  action: string,
  userName: string,
): void {
  console.log(`=== ${action} as ${userName} successfully ===\n`);
  console.log(config);
  console.log("\n===========================================");
}

export async function printFeeds(feeds: Feed[]): Promise<void> {
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

export function printPosts(posts: Post[]): void {
  console.log("=== Posts ===\n");
  for (let i = 0; i < posts.length; i++) {
    console.log(`Post ${i + 1}`);
    console.log(` * title: ${posts[i].title}`);
    console.log(` * description: ${posts[i].description}`);
    console.log(` * link: ${posts[i].link}`);
    console.log(
      ` * date: ${posts[i].pubDate.toLocaleString("en-US", timeOtions)}`,
    );
  }
  console.log("\n==================");
}
