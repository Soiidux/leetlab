import dotenv from "dotenv";

dotenv.config();

interface Config {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  NODE_ENV: string;
  JUDGE0_API_URL: string;
}

const config: Config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",  
  NODE_ENV: process.env.NODE_ENV || "development",
  JUDGE0_API_URL: process.env.JUDGE0_API_URL || "",
};
export default config;
