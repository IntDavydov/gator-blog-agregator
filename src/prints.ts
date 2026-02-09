import { Config } from "./config.js";
import { FeedFollowInfo, ReturnFeedFollow } from "./lib/db/queries/follows.js";
import { Feed, User } from "./lib/db/schema.js";
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

export function printUnfollow(user: User, feed: Feed): void {
  console.log("=== You've unfollower the feed ===\n");
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

export function printSuccess(config: Config, action: string, userName: string) {
  console.log(`=== ${action} as ${userName} successfully ===\n`);
  console.log(config);
  console.log("\n===========================================");
}
