import { User } from "./lib/db/schema.js";

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
  message = "Cmd called without needed args",
): void {
  if (args.length === 0) {
    throw new Error(message);
  }
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
