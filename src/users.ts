import { Config, readConfig, setUser } from "./config.js";
import { createUser, getUser, getUsers } from "./lib/db/queries/users.js";
import { isOneArg, isUser } from "./utils.js";

export async function handlerLogin(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  isOneArg(args, `No username provided: ${cmdName} <name>`);

  const userName = args[0];

  const user = await getUser(userName); // User object or undefined
  isUser(userName, user); // error thrown or user returned

  await setUser(userName);
  const config = await readConfig();
  printSucces(config, "logged in", userName);
}

export async function handlerRegister(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  isOneArg(args, `No username provided: ${cmdName} <name>`);

  const userName = args[0];

  const user = await createUser(userName); // undefined or created User object
  if (!user) {
    throw new Error(`User ${userName} already exists.`);
  }

  await setUser(userName);

  const config = await readConfig();
  printSucces(config, "registered", userName);
}

export async function handlerUsers(_: string): Promise<void> {
  const users = await getUsers(); // empty array or array of Users

  if (users.length === 0) {
    console.log(`No users registered yet`);
    return;
  }

  const { currentUserName } = await readConfig();

  for (const user of users) {
    console.log(
      `* ${user.name} ${currentUserName === user.name ? "(current)" : ""}`,
    );
  }
}

function printSucces(config: Config, action: string, userName?: string) {
  console.log(
    `=== User ${userName ? userName : ""} ${action} successfully ===\n`,
  );
  console.log(config);
  console.log("\n===========================================");
}
