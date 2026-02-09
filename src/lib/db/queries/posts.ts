import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { NewPost, Post, posts } from "../schema.js";

export async function createPost(post: NewPost): Promise<Post> {
  const { title, description, link, pubDate, feedId } = post;

  const [result] = await db
    .insert(posts)
    .values({ title, description: description ?? "", link, pubDate, feedId })
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function getPostsForUser(postsNum: number = 2): Promise<Post[]> {
  const userPosts = await db
    .select()
    .from(posts)
    .orderBy(sql`${posts.pubDate} desc`)
    .limit(postsNum);

  return userPosts;
}
