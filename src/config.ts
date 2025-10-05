import { readFileSync, writeFileSync } from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

const filePath = path.join(os.homedir(), ".gatorconfig.json");

export const setUser = (username: string) => {
  const cfg = readConfig();
  cfg.currentUserName = username;
  writeConfig(cfg);
};

export const readConfig = () => {
  const data = readFileSync(filePath, "utf-8");
  const cfgJson = JSON.parse(data);
  return validateConfig(cfgJson);
};

function validateConfig(rawConfig: any) {
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

function writeConfig(config: Config) {
  const rawConfig = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };

  const data = JSON.stringify(rawConfig, null, 2);
  writeFileSync(filePath, data, { encoding: "utf-8" });
}
