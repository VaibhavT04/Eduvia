import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  out: "./drizzle", // Migration files ke liye folder
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING, // .env se connection string
  },
});