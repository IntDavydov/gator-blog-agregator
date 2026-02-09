import { and, eq } from "drizzle-orm";
import { db } from "../index.js";
import { type FeedFollow, feedFollows, feeds, users } from "../schema.js";
import { ensureDBCall } from "src/utils.js";

export type FeedFollowInfo = {
  userName: string;
  feedName: string;
  feedUrl: string;
};

export type ReturnFeedFollow = FeedFollow & FeedFollowInfo;

export async function createFeedFollow(
  userId: string,
  feedId: string,
): Promise<ReturnFeedFollow> {
  const [feedFollow] = await db // return FeedFollow object or undefined
    .insert(feedFollows)
    .values({ userId, feedId })
    .onConflictDoNothing()
    .returning();

  const feedFollowRecord = ensureDBCall(
    feedFollow,
    "Failed to create feedFollow",
  ); // error thrown or object returned

  const [userFeed] = await db // return object or undefined
    .select({ userName: users.name, feedName: feeds.name, feedUrl: feeds.url })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
    .limit(1);

  const feedFollowInfo = ensureDBCall(
    userFeed,
    "Failed to fetch user/feed info",
  ); // error thrown or object returned

  return {
    ...feedFollowRecord,
    ...feedFollowInfo,
  };
}

export async function getFeedFollowsForUser(
  userId: string,
): Promise<FeedFollowInfo[]> {
  const userFeedFollows = await db
    .select({ userName: users.name, feedName: feeds.name, feedUrl: feeds.url })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));

  return userFeedFollows;
}

export async function unfollowFeed(
  userId: string,
  feedId: string,
): Promise<FeedFollow> {
  const [unfollowedFeedFollow] = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
    .returning();

  return unfollowedFeedFollow;
}

/**
 * 🔍 Filtered version (most real use)
Get follows for one user
.where(eq(feedFollows.userId, userId))

Get followers of one feed
.where(eq(feedFollows.feedId, feedId))
 */
