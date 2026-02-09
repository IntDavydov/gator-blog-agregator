import { readConfig } from "./config.js";
import { getFeedByURL } from "./lib/db/queries/feeds.js";
import {
  createFeedFollow,
  getFeedFollowsForUser,
  ReturnFeedFollow,
  unfollowFeed,
} from "./lib/db/queries/follows.js";
import { getUser } from "./lib/db/queries/users.js";
import { User } from "./lib/db/schema.js";
import { printFollowUnfollow, printUserFollows } from "./prints.js";
import { isConfigUsername, isOneArg, isUser } from "./utils.js";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  isOneArg(args, `Feed url is not provided: ${cmdName} <url>`);

  const feedUrl = args[0];
  const feed = await getFeedByURL(feedUrl);
  if (!feed) {
    throw new Error(`Feed ${feedUrl} does not exist.`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);

  printFollowUnfollow(feedFollow, "followed");
}

export async function handlerPrintFollowing(
  _: string,
  user: User,
  ...args: string[]
): Promise<void> {

  const userName = args[0] || user.name;
  const actionUser = await getUser(userName);
  isUser(userName, actionUser); // error thrown or User object

  const userFeedFollows = await getFeedFollowsForUser(actionUser.id); // empty array or array of FeedFollows
  if (userFeedFollows.length === 0) {
    console.log("=== No follows yet === ");
    return;
  }

  printUserFollows(userName, userFeedFollows);
}

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  isOneArg(args, `Feed url is not provided: ${cmdName} <url>`);

  const feedUrl = args[0];
  const feed = await getFeedByURL(feedUrl);
  if (!feed) {
    throw new Error(`Feed ${feedUrl} does not exist.`);
  }

  const unfollowedFeed = await unfollowFeed(user.id, feed.id); // error or FeedFollow object

  if (!unfollowedFeed) {
    throw new Error(`Feed ${feed.url} does not exist.`);
  }

  const feedFollow: ReturnFeedFollow = {
    createdAt: feed.createdAt,
    updatedAt: feed.updatedAt,
    userId: user.id,
    feedId: feed.id,
    feedName: feed.name,
    userName: user.name,
    feedUrl: feed.url,
  };

  printFollowUnfollow(feedFollow, "unfollowed");
}

// TODO: separate all print functions into one file
// TODO: generic error handling
// TODO: rewrite isUser to be generic
