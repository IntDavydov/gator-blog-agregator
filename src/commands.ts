import { readConfig, setUser } from "./config.js";
import {
  createUser,
  getUser,
  getUsers,
  resetUsers,
} from "./lib/db/queries/users.js";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export async function handlerLogin(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error("No username provided: cmd <name>");
  }

  const username = args[0];

  await getUser(username); // error thrown or User object returned

  await setUser(username);
  const config = await readConfig();
  console.log("=== User is created ===\n", config);
}

export async function handlerRegister(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error("No username provided: cmd <name>");
  }

  const username = args[0];

  await createUser(username);
  await setUser(username);

  const config = await readConfig();
  console.log("=== User registered successfully ===\n", config);
}

export async function handlerReset(cmdName: string): Promise<void> {
  await resetUsers();
  console.log("=== Users table reset ===");
}

export async function handlerUsers(cmdName: string): Promise<void> {
  const users = await getUsers();
  const { currentUserName } = await readConfig();

  for (const user of users) {
    console.log(`* ${user.name} ${currentUserName === user.name ? "(current)" : ""}`);
  }
}

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void { 
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error("Command not found");
  }

  await handler(cmdName, ...args);
}
