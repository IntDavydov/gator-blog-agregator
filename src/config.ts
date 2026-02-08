import { readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

export async function setUser(userName: string): Promise<void> {
  const config = await readConfig();
  config.currentUserName = userName;
  await writeConfig(config);
}

export async function readConfig(): Promise<Config> {
  const configPath = getConfigPath(); // returns os specific path to config file in home dir
  const rawConfig = await readFile(configPath, { encoding: "utf-8" }); // json config file

  const validatedConfig = validateConfig(JSON.parse(rawConfig)); // narrow down any from JSON.parse to Config type object

  return validatedConfig;
}

export function readConfigSync(): Config {
  const configPath = getConfigPath(); // returns os specific path to config file in home dir
  const rawConfig = readFileSync(configPath, { encoding: "utf-8" }); // json config file

  const validatedConfig = validateConfig(JSON.parse(rawConfig)); // narrow down any from JSON.parse to Config type object

  return validatedConfig;
}

function getConfigPath(): string {
  const homePath = os.homedir(); //return path with trailing slash
  const configName = ".gatorconfig.json";
  const configPath = path.join(homePath, configName);

  return configPath;
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return config;
}

async function writeConfig(updatedConfig: Config): Promise<void> {
  const configPath = getConfigPath();

  const rawConfig = {
    db_url: updatedConfig.dbUrl,
    current_user_name: updatedConfig.currentUserName,
  };

  const json = JSON.stringify(rawConfig, null, 2);

  await writeFile(configPath, json, "utf-8");
}
