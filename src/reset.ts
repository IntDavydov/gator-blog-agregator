import { resetUsers } from "./lib/db/queries/users.js";

export async function handlerReset(_: string): Promise<void> {
  await resetUsers();
  console.log("=== Users table reset ===");
}