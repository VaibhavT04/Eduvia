import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials:{
    url:'ostgresql://neondb_owner:npg_w38ZYdhzISmL@ep-lingering-salad-a8l51swm-pooler.eastus2.azure.neon.tech/ai-study-material?sslmode=require'

  }
});
