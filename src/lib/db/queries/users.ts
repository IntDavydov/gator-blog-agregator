import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import type { User } from "../schema";

export async function createUser(name: string): Promise<User> {
  const [result] = await db
    .insert(users)
    .values({ name })
    .onConflictDoNothing() // skip query return undefined, only work for constrains defined in schema
    .returning();

  return result; // returns created User object or undefined
}

export async function getUser(userName: string): Promise<User> {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.name, userName)); // undefined if not found
  return result; // returns User object or undefined
}

export async function getUserById(id: string): Promise<User> {
  const [result] = await db.select().from(users).where(eq(users.id, id));
  return result;
}

export async function getUsers(): Promise<User[]> {
  return await db.select().from(users); // empty array or array of Users
}

export async function resetUsers(): Promise<void> {
  await db.delete(users);
}
