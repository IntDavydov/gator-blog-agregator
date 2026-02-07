import { defineConfig } from "drizzle-kit";
import { readConfigSync } from "./src/config.ts";

const url = readConfigSync().dbUrl;

export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "src/lib/db",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
