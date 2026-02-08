import { UserFeedFollows, ReturnFeedFollow } from "./lib/db/queries/follows.js";
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


export function printFollow(ReturnFeedFollow: ReturnFeedFollow): void {
  const { userName, feedName, feedUrl, createdAt } = ReturnFeedFollow;

  console.log("=== You've followed the feed ===\n");

  console.log(`* User name: ${userName}`);
  console.log(`* Followed on: ${createdAt.toLocaleDateString("en-US", timeOtions)}`);
  console.log(`* Feed name: ${feedName}`);
  console.log(`* Url: ${feedUrl}`);

  console.log("\n================================");
}

export function printUserFollows(username: string, userFeedFollows: UserFeedFollows[]): void {
    console.log(`=== ${username} follows ===\n`)
    let count = 1;
    for(const userFeedFollow of userFeedFollows) {
        console.log(`Feed ${count}:`)

        console.log(` * name: ${userFeedFollow.feedName}`)
        console.log(` * url: ${userFeedFollow.feedUrl}`)
        if(count < userFeedFollows.length) {
            console.log()
        }
        count += 1;
    }
    console.log("\n===========================")
}