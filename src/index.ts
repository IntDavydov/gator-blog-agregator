import {
  type CommandsRegistry,
  runCommand,
  registerCommand,
} from "./commands.js";
import { argv } from "node:process";
import { handlerReset } from "./reset.js";
import { handlerLogin, handlerRegister, handlerUsers } from "./users.js";
import { handlerAgg } from "./aggregate.js";

async function main(): Promise<void> {
  const cliArgs = argv.slice(2);

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
