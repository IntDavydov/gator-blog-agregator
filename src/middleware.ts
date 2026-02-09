import { CommandHandler } from "./commands.js";
import { readConfig } from "./config.js";
import { getUser } from "./lib/db/queries/users.js";
import { User } from "./lib/db/schema.js";
import { isConfigUsername, isUser } from "./utils.js";

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type MiddlewareLoggedIn = (
  handler: UserCommandHandler,
) => CommandHandler;

export function middlewareLoggedIn(
  userHandler: UserCommandHandler,
): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const config = await readConfig();
    const currentUserName = isConfigUsername(config.currentUserName); // throw error or object

    const user = await getUser(currentUserName);
    isUser(currentUserName, user); // throw error or user object

    await userHandler(cmdName, user, ...args);
  };
}
