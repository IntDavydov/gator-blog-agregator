import { readConfig } from "./config.js";
import { getFeedByURL } from "./lib/db/queries/feeds.js";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "./lib/db/queries/follows.js";
import { getUser } from "./lib/db/queries/users.js";
import { printFollow, printUserFollows } from "./prints.js";
import { isConfigUsername, isOneArg, isUser } from "./utils.js";

export async function handlerFollow(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  isOneArg(args, `Feed url is not provided: ${cmdName} <url>`);

  const config = await readConfig();
  const currentUserName = isConfigUsername(config.currentUserName); // string or error thrown

  const user = await getUser(currentUserName);
  isUser(currentUserName, user); // error thrown or user returned

  const url = args[0];
  const feed = await getFeedByURL(url);
  const feedFollow = await createFeedFollow(user.id, feed.id);

  printFollow(feedFollow);
}

export async function handlerFollowing(
  _: string,
  ...args: string[]
): Promise<void> {
  const config = await readConfig();
  const currentUserName = isConfigUsername(config.currentUserName); // throw error or returb name

  const userName = args[0] || currentUserName;
  const user = await getUser(userName);
  isUser(userName, user); // error thrown or User object

  const userFeedFollows = await getFeedFollowsForUser(user.id); // empty array or array of FeedFollows
  if (userFeedFollows.length === 0) {
    console.log("=== No follows yet === ");
    return;
  }

  printUserFollows(userName, userFeedFollows);
}

// TODO: separate all print functions into one file
