import { Config, readConfig, setUser } from "./config.js";
import { createUser, getUser, getUsers } from "./lib/db/queries/users.js";

export async function handlerLogin(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error(`No username provided: ${cmdName} <name>`);
  }

  const username = args[0];

  const user = await getUser(username); // User object or undefined

  if (!user) {
    throw new Error(
      `Wrong credentials: username ${username} is not registered.`,
    );
  }

  await setUser(username);
  const config = await readConfig();
  printSucces(config, "logged in", username);
}

export async function handlerRegister(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error(`No username provided: ${cmdName} <name>`);
  }

  const username = args[0];

  const user = await createUser(username); // undefined or created User object
  if (!user) {
    throw new Error(`User ${username} already exists.`);
  }

  await setUser(username);

  const config = await readConfig();
  printSucces(config, "registered", username);
}

export async function handlerUsers(_: string): Promise<void> {
  const users = await getUsers(); // empty array or array of Users

  if (users.length === 0) {
    throw new Error(`No users registered yet`);
  }

  const { currentUserName } = await readConfig();

  for (const user of users) {
    console.log(
      `* ${user.name} ${currentUserName === user.name ? "(current)" : ""}`,
    );
  }
}

function printSucces(config: Config, action: string, username?: string) {
  console.log(
    `=== User ${username ? username : ""} ${action} successfully ===\n`,
  );
  console.log(config);
  console.log("\n===========================================");
}
