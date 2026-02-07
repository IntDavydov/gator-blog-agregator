import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import type { User } from "../schema";

export async function createUser(name: string): Promise<User> {
  const [result] = await db
    .insert(users)
    .values({ name })
    .onConflictDoNothing() // only work for constrains defined in schema
    .returning();

  if (!result) {
    throw new Error("User with this name already exists.");
  }

  return result; // returns created User object
}

export async function getUser(name: string): Promise<User> {
  const [result] = await db.select().from(users).where(eq(users.name, name)); // undefined if not found

  if (!result) {
    throw new Error(`Wrong credentials: username ${name} is not registered.`);
  }

  return result; // returns User object in an array
}

export async function getUsers(): Promise<User[]> {
  const result = await db.select().from(users); // 0

  if (!result) {
    throw new Error(`No users registered yet`);
  }

  return result; // returns array of Users
}

export async function resetUsers(): Promise<void> {
  await db.execute(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
}
