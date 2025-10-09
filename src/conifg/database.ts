import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const client = new Client({
  host: process.env.DB_HOST!,
  port: +process.env.DB_PORT!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

export const connectDB = async () => {
  await client.connect();
  return client;
};
