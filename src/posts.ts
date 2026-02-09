import { getPostsForUser } from "./lib/db/queries/posts.js";
import { User } from "./lib/db/schema.js";
import { printPosts } from "./prints.js";

export async function handlerBrowse(
  _: string,
  __: User,
  ...args: string[]
): Promise<void> {
  const postsNum = parseInt(args[0]) || 2;
  const latestPosts = await getPostsForUser(postsNum);
  if (!latestPosts) {
    console.log("No posts yet. Add new feed or wait till other add it.");
    return;
  }
  printPosts(latestPosts);
}
