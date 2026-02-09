import { createPost } from "./lib/db/queries/posts.js";
import { User } from "./lib/db/schema.js";
import { RSSFeed } from "./rss.js";

export function isConfigUsername(currentUserName?: string): string {
  if (!currentUserName) {
    throw new Error("You're not logged in.");
  }

  return currentUserName;
}

export function isUser(userName: string, user?: User): User {
  if (!user) {
    throw new Error(
      `Wrong credentials: username ${userName} is not registered.`,
    );
  }

  return user;
}

export function ensureDBCall<T>(
  value: T | undefined,
  message = "Not found",
): T {
  if (!value) throw new Error(message);
  return value;
}

export function isOneArg(
  args: string[],
  message = "Cmd called without mandatory args",
): void {
  if (args.length === 0) {
    throw new Error(message);
  }
}

export function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error("Fetch duration wrong format: should be 1s/m/h");
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
  };

  return value * multipliers[unit];
}

export async function savePosts(
  feedContent: RSSFeed,
  feedId: string,
): Promise<void> {
  const {
    channel: { item },
  } = feedContent;

  for (const fetchedPost of item) {
    const dbPost = {
      ...fetchedPost,
      pubDate: new Date(fetchedPost.pubDate),
      feedId,
    };

    console.log(`=== Adding post: ${fetchedPost.title}\n`);
    await createPost(dbPost);
  }

  console.log("=== All posts are saved ===");
}

export const timeOtions: Intl.DateTimeFormatOptions = {
  weekday: "short", // Mon, Tue...
  year: "numeric",
  month: "short", // Jan, Feb...
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};
