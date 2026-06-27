import dotenv from "dotenv";

dotenv.config();

interface Config {
    PORT: string;
    NODE_ENV: string;
}

const config: Config = {
    PORT: process.env.PORT || "3000",
    NODE_ENV: process.env.NODE_ENV || "development",
};
export default config;
