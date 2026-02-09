import {
  type CommandsRegistry,
  runCommand,
  registerCommand,
} from "./commands.js";
import { argv } from "node:process";
import { handlerReset } from "./reset.js";
import { handlerLogin, handlerRegister, handlerUsers } from "./users.js";
import { handlerAgg } from "./aggregate.js";
import { handlerAddfeed, handlerFeeds } from "./feeds.js";
import {
  handlerFollow,
  handlerPrintFollowing,
  handlerUnfollow,
} from "./follows.js";
import { middlewareLoggedIn } from "./middleware.js";
import { handlerBrowse } from "./posts.js";

async function main(): Promise<void> {
  const cliArgs = argv.slice(2); // first two args are pathes to executables: node and file

  if (cliArgs.length === 0) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const commandsRegistry: CommandsRegistry = {};
  const [cmdName, ...args] = cliArgs;

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(
    commandsRegistry,
    "addfeed",
    middlewareLoggedIn(handlerAddfeed),
  );
  registerCommand(commandsRegistry, "feeds", handlerFeeds);
  registerCommand(
    commandsRegistry,
    "follow",
    middlewareLoggedIn(handlerFollow),
  );
  registerCommand(
    commandsRegistry,
    "following",
    middlewareLoggedIn(handlerPrintFollowing),
  );
  registerCommand(
    commandsRegistry,
    "unfollow",
    middlewareLoggedIn(handlerUnfollow),
  );
  registerCommand(
    commandsRegistry,
    "browse",
    middlewareLoggedIn(handlerBrowse),
  );

  try {
    await runCommand(commandsRegistry, cmdName, ...args);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();
