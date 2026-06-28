import { drizzle } from "drizzle-orm/node-postgres";
import config from "../backendConfig.js";

const db = drizzle(config.DATABASE_URL);

export default db;

