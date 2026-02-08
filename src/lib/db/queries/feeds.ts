import { db } from "../index.js";
import { Feed, feeds } from "../schema.js";

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
