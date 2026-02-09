import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { Feed, feeds } from "../schema.js";
import { ensureDBCall } from "src/utils.js";

export async function addFeed(
  name: string,
  url: string,
  userId: string,
): Promise<Feed> {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, userId })
    .onConflictDoNothing()
    .returning(); // return Feed object on creation

  return result; // return undefined or Feed object
}

export async function getFeeds(): Promise<Feed[]> {
  return await db.select().from(feeds); // empty array or array of Feed objects
}

export async function getFeedByURL(url: string): Promise<Feed> {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  const feedRecord = ensureDBCall(result); // error thrown or Feed object returned
  return feedRecord;
}

export async function markFeedFetched(feedId: string): Promise<Feed> {
  const date = new Date();
  const [result] = await db
    .update(feeds)
    .set({ updatedAt: date, lastFetchedAt: date })
    .where(eq(feeds.id, feedId))
    .returning();

  return result;
}

export async function getNextFeedToFetch(): Promise<Feed> {
  const [result] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} nulls last`)
    .limit(1);

  return result;
}
