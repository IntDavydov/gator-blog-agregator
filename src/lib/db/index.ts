import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { readConfigSync } from "../../config";

const config = readConfigSync();
const conn = postgres(config.dbUrl);
export const db = drizzle(conn, { schema });
